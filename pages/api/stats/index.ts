import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthorization } from "@/utils/api";
import { ISession } from "@/utils/models";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";

type getPipelineFunctionsParams = {
  userId: string;
  visibility: ISession["user"]["visibilidade"];
  after?: string;
  before?: string;
};
function getGeneralIndicatorsByDatePipeline({
  userId,
  visibility,
  after,
  before,
}: getPipelineFunctionsParams) {
  var pipeline: any;
  if (visibility == "PRÓPRIA") {
    pipeline = [
      {
        $group: {
          _id: {
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$dataInsercao",
                },
              },
            },
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$dataInsercao",
                },
              },
            },
          },
          contractSigned: {
            $sum: {
              $cond: [
                {
                  $eq: [{ $ifNull: ["$assinado", false] }, true],
                },
                1,
                0,
              ],
            },
          },
          projectLost: {
            $sum: {
              $cond: [
                {
                  $ifNull: ["$dataPerda", false],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          "_id.month": -1,
          "_id.day": -1,
        },
      },
    ];
    var matchObj = {
      $match: {
        dataInsercao: {
          $and: [{ $gte: after }, { $lte: before }],
        },
      },
    };
    if (after && before) pipeline.unshift(matchObj);
  } else {
    let matchObj: any = {
      "responsavel.id": userId,
    };

    if (after && before) {
      matchObj.dataInsercao = {
        $and: [{ $gte: after }, { $lte: before }],
      };
    }
    pipeline = [
      {
        $match: matchObj,
      },
      {
        $group: {
          _id: {
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$dataInsercao",
                },
              },
            },
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$dataInsercao",
                },
              },
            },
          },
          contractSigned: {
            $sum: {
              $cond: [
                {
                  $eq: [{ $ifNull: ["$assinado", false] }, true],
                },
                1,
                0,
              ],
            },
          },
          projectLost: {
            $sum: {
              $cond: [
                {
                  $ifNull: ["$dataPerda", false],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          "_id.month": -1,
          "_id.day": -1,
        },
      },
    ];
  }
  return pipeline;
}
function getProjectLossReasonPipeline({
  userId,
  visibility,
  after,
  before,
}: getPipelineFunctionsParams) {
  var pipeline;
  if (visibility == "GERAL") {
    var matchObj: any = {
      motivoPerda: { $ne: null },
    };
    if (after && before) {
      matchObj.dataInsercao = {
        $and: [{ $gte: after }, { $lte: before }],
      };
    }
    pipeline = [
      {
        $match: matchObj,
      },
      {
        $group: {
          _id: "$motivoPerda",
          qtde: {
            $count: {},
          },
        },
      },
    ];
  } else {
    var matchObj: any = {
      "responsavel.id": userId,
      motivoPerda: { $ne: null },
    };
    if (after && before) {
      matchObj.dataInsercao = {
        $and: [{ $gte: after }, { $lte: before }],
      };
    }
    pipeline = [
      {
        $match: matchObj,
      },
      {
        $group: {
          _id: "$motivoPerda",
          qtde: {
            $count: {},
          },
        },
      },
    ];
  }
  return pipeline;
}
type GetResponse = {
  data: unknown;
};

const getStats: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(
    req,
    "projetos",
    "serResponsavel",
    true
  );
  const { after, before } = req.query;
  if (
    typeof after != "string" ||
    !after ||
    typeof before != "string" ||
    !before
  )
    throw new createHttpError.BadRequest("Parâmetros de período inválidos.");
  //   const session = {
  //     user: {
  //       id: "6463d7484a8f5e909a4dae19",
  //       visibilidade: "GERAL",
  //     },
  //   };
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");

  const generalIndicatorsByDatePipeline = getGeneralIndicatorsByDatePipeline({
    userId: session.user.id,
    visibility: session.user.visibilidade,
    after: after,
    before: before,
  });
  const projectLossReasonPipeline = getProjectLossReasonPipeline({
    userId: session.user.id,
    visibility: session.user.visibilidade,
    after: after,
    before: before,
  });

  const generalIndicatorsByDate = await collection
    .aggregate(generalIndicatorsByDatePipeline)
    .toArray();
  const projectLossReasons = await collection
    .aggregate(projectLossReasonPipeline)
    .toArray();

  res.status(200).json({ data: projectLossReasons });
};

export default apiHandler({
  GET: getStats,
});
