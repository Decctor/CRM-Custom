import { ITechnicalAnalysis } from "@/utils/models";
import React, { useState } from "react";
import GeneralInfo from "./Blocks/GeneralInfo";
import SystemInfo from "./Blocks/SystemInfo";
import PAInfo from "./Blocks/PAInfo";
import TransformerInfo from "./Blocks/TransformerInfo";
import StructureInfo from "./Blocks/StructureInfo";
import InstallationInfo from "./Blocks/InstallationInfo";
import ReviewInfo from "./Blocks/ReviewInfo";
type RemoteUrbanProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  resetSolicitationType: () => void;
  projectId?: string;
};

function RemoteUrban({
  requestInfo,
  setRequestInfo,
  resetSolicitationType,
  projectId,
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
          goToPreviousStage={() => setStage((prev) => prev - 1)}
        />
      ) : null}
      {stage == 3 ? (
        <PAInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          files={files}
          setFiles={setFiles}
        />
      ) : null}
      {stage == 4 ? (
        <TransformerInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          files={files}
          setFiles={setFiles}
        />
      ) : null}
      {stage == 5 ? (
        <StructureInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          files={files}
          setFiles={setFiles}
        />
      ) : null}
      {stage == 6 ? (
        <InstallationInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          files={files}
          setFiles={setFiles}
        />
      ) : null}
      {stage == 7 ? (
        <ReviewInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToNextStage={() => setStage((prev) => prev + 1)}
          files={files}
          setFiles={setFiles}
          projectId={projectId}
        />
      ) : null}
    </div>
  );
}

export default RemoteUrban;
