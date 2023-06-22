import React, { useState } from "react";
import DropdownSelect from "../Inputs/DropdownSelect";
import { leadLoseJustification } from "@/utils/constants";
import { VscChromeClose } from "react-icons/vsc";
import { TiCancel } from "react-icons/ti";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
type LoseProjectProps = {
  projectId: string;
  responsibleId: string;
  oportunityId: string | undefined | null;
};
function LoseProject({
  projectId,
  responsibleId,
  oportunityId,
}: LoseProjectProps) {
  const queryClient = useQueryClient();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [cause, setCause] = useState<string | null>(null);
  const { mutate: updateProject } = useMutation({
    mutationKey: ["editProject"],
    mutationFn: async (changes: { [key: string]: any }) => {
      try {
        const { data } = await axios.put(
          `/api/projects?id=${projectId}&responsavel=${responsibleId}`,
          {
            changes: changes,
          }
        );
        if (oportunityId) {
          await axios.post("/api/utils/updateOportunityRD", {
            oportunityId: oportunityId,
            operation: "PERDER",
            lossReason: cause,
          });
          toast.success("Alteração de oportunidade bem sucedida.");
        }
        // queryClient.invalidateQueries({ queryKey: ["project"] });
        // if (data.message) toast.success(data.message);
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          return;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          return;
        }
      }
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message);
    },
  });
  console.log("ID OPORTUNIDADE", oportunityId);
  return (
    <div className="flex w-fit items-center justify-center">
      {menuIsOpen ? (
        <div className="flex w-[350px] items-center gap-1">
          <div className="grow">
            <DropdownSelect
              categoryName="MOTIVO DA PERDA"
              value={
                cause
                  ? Object.keys(leadLoseJustification).indexOf(cause) + 1
                  : null
              }
              options={Object.keys(leadLoseJustification).map(
                (justification, index) => {
                  return {
                    id: index + 1,
                    label: justification,
                    value: justification,
                  };
                }
              )}
              onChange={(value) => {
                setCause(value.value);
              }}
              onReset={() => {
                setCause(null);
              }}
              selectedItemLabel="NÃO DEFINIDO"
              width="250px"
            />
          </div>
          <button
            onClick={() => {
              if (cause) {
                updateProject({
                  dataPerda: new Date().toISOString(),
                  motivoPerda: cause,
                });
              } else {
                toast.error("Por favor, preencha o motivo da perda.");
              }
            }}
            className="h-[40px] rounded-md bg-red-300 p-1 text-white shadow-sm hover:bg-red-500"
          >
            <VscChromeClose />
          </button>
          <button
            onClick={() => setMenuIsOpen(false)}
            className="h-[40px] rounded-md bg-gray-300 p-1 text-white shadow-sm hover:bg-gray-500"
          >
            <TiCancel />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setMenuIsOpen(true)}
          className="flex w-fit min-w-[250px] items-center justify-center gap-2  rounded bg-red-300 p-2 font-medium text-white duration-300 hover:scale-[1.02] hover:bg-red-500"
        >
          <p className="text-xs">PERDER PROJETO</p>
          {/* <VscChromeClose /> */}
        </button>
      )}
    </div>
  );
}

export default LoseProject;
