import React, { useState } from "react";
import ContractInfo from "./SolarSystem/ContractInfo";
import JourneyInfo from "./SolarSystem/JourneyInfo";
import HomologationInfo from "./SolarSystem/HomologationInfo";
import SystemInfo from "./SolarSystem/SystemInfo";
import StructureInfo from "./SolarSystem/StructureInfo";
import PAInfo from "./SolarSystem/PAInfo";
import OeMPlansInfo from "./SolarSystem/OeMPlansInfo";
import PaymentInfo from "./SolarSystem/PaymentInfo";
import CreditDistributionInfo from "./SolarSystem/CreditDistributionInfo";
import DocumentAttachmentInfo from "./SolarSystem/DocumentAttachmentInfo";
import ReviewInfo from "./SolarSystem/ReviewInfo";
import { IContractRequest, IProposeInfo } from "@/utils/models";
import { getModulesQty } from "@/utils/methods";
type SolarSystemFormProps = {
  requestInfo: IContractRequest;
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>;
  proposeInfo: IProposeInfo;
};
function SolarSystemForm({
  requestInfo,
  setRequestInfo,
  proposeInfo,
}: SolarSystemFormProps) {
  const [stage, setStage] = useState(1);
  return (
    <>
      {stage == 1 ? (
        <ContractInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 2 ? (
        <JourneyInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 3 ? (
        <HomologationInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 4 ? (
        <SystemInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          kit={proposeInfo.kit}
        />
      ) : null}
      {stage == 5 ? (
        <StructureInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 6 ? (
        <PAInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 7 ? (
        <OeMPlansInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          modulesQty={getModulesQty(proposeInfo.kit?.modulos)}
          distance={proposeInfo.premissas.distancia}
        />
      ) : null}
      {stage == 8 ? (
        <PaymentInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 9 ? (
        <CreditDistributionInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 10 ? (
        <DocumentAttachmentInfo
          projectInfo={proposeInfo.infoProjeto}
          requestInfo={requestInfo}
          proposeInfo={proposeInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 11 ? (
        <ReviewInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          kit={proposeInfo.kit}
          modulesQty={getModulesQty(proposeInfo.kit?.modulos)}
          distance={proposeInfo.premissas.distancia}
          projectId={proposeInfo?.infoProjeto?._id}
          proposeInfo={proposeInfo}
        />
      ) : null}
    </>
  );
}

export default SolarSystemForm;
