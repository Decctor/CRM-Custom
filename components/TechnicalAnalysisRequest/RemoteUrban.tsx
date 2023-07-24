import { ITechnicalAnalysis } from "@/utils/models";
import React, { useState } from "react";
import GeneralInfo from "./Blocks/GeneralInfo";
import SystemInfo from "./Blocks/SystemInfo";
import PAInfo from "./Blocks/PAInfo";
type RemoteUrbanProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  resetSolicitationType: () => void;
};

function RemoteUrban({
  requestInfo,
  setRequestInfo,
  resetSolicitationType,
}: RemoteUrbanProps) {
  const [stage, setStage] = useState(1);
  const [files, setFiles] = useState<{
    [key: string]: {
      title: string;
      file: File | null | string;
    };
  }>();
  return (
    <div className="flex w-full grow flex-col ">
      {stage == 1 ? (
        <GeneralInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
          resetSolicitationType={resetSolicitationType}
          files={files}
          setFiles={setFiles}
        />
      ) : null}
      {stage == 2 ? (
        <SystemInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 3 ? (
        <PAInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
    </div>
  );
}

export default RemoteUrban;
