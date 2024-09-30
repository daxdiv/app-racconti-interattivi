import { Eye, Trash2, Unlink } from "lucide-react";
import {
  Handle,
  Position,
  useHandleConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Edit from "@/components/ui/nodes/doublePage/edit";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { TOOLTIP_DELAY_DURATION } from "@/constants";
import useNodeUtils from "@/hooks/useNodeUtils";
import { truncate } from "@/lib/utils";
import { type PageSchema, pageSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";
import { NodeQueryProvider } from "@/contexts/nodeQueryContext";
import Preview from "@/components/ui/nodes/doublePage/preview";
import { Button } from "@/components/ui/button";

type WithNodeQueryProps = NodeProps<Node>;

function WithNodeQuery({ id }: WithNodeQueryProps) {
  return (
    <NodeQueryProvider id={id}>
      <PageNode id={id} />
    </NodeQueryProvider>
  );
}

function PageNode({ id }: { id: WithNodeQueryProps["id"] }) {
  const { onNodeDelete, isNodeUnlinked } = useNodeUtils();
  const { data, isLoading } = useNodeQueryContext();
  const form = useForm<PageSchema>({
    resolver: zodResolver(pageSchema),
    defaultValues: data || {
      type: "base",
      label: "Titolo",
      pages: [
        {
          text: {
            content: "",
            position: "TopLeft",
          },
        },
        {
          text: {
            content: "",
            position: "TopRight",
          },
        },
      ],
      background: new File([], ""),
      audio: new File([], ""),
    },
  });

  const sourceConnections = useHandleConnections({ type: "source" });
  const sourceConnectionsLimit = form.watch("type") === "choice" ? 2 : 1;

  useEffect(() => {
    form.reset(data);
  }, [data]); // eslint-disable-line

  if (isLoading) return null;

  return (
    <FormProvider {...form}>
      {parseInt(id) !== 0 && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ padding: "3px" }}
          isConnectableStart={false}
        />
      )}

      <Card className="w-[300px]">
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <div className="flex justify-center items-center gap-x-2">
            <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="nodrag nopan cursor-default">
                    {truncate(form.getValues("label"), 12)}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent className="max-w-52 break-words px-6">
                  <ul className="list-disc">
                    <li>{form.getValues("pages.0.text.content")}</li>
                    <li>{form.getValues("pages.1.text.content")}</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isNodeUnlinked(id) && (
              <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Unlink
                      className="cursor-default text-primary py-1 px-1 rounded-full bg-yellow-500 hover:bg-yellow-500/70 nodrag nopan"
                      size={24}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Nodo non collegato</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex justify-center items-center gap-x-1">
            {parseInt(id) !== 0 && (
              <AlertDialog>
                <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                  <Tooltip>
                    <AlertDialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Trash2
                          className="cursor-pointer text-secondary p-1 rounded-full bg-destructive hover:bg-destructive/70 nodrag nopan"
                          size={24}
                        />
                      </TooltipTrigger>
                    </AlertDialogTrigger>
                    <TooltipContent>
                      Elimina "{truncate(form.getValues("label"), 12)}"
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Eliminare "{truncate(form.getValues("label"), 12)}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Una volta eliminate, dovrai ricrearle da zero.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => {
                        onNodeDelete(id);
                      }}
                      className="bg-destructive hover:bg-destructive/70"
                    >
                      Si
                    </AlertDialogAction>
                    <AlertDialogCancel className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary">
                      No
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex justify-center items-center gap-x-1">
          <Edit id={id} />
          <Preview
            trigger={
              <Button
                className="w-1/2"
                variant="outline"
              >
                <Eye
                  className="mr-2"
                  size={16}
                />{" "}
                Anteprima
              </Button>
            }
          />
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={sourceConnections.length < sourceConnectionsLimit}
        style={{ padding: "3px" }}
      />
    </FormProvider>
  );
}

export default WithNodeQuery;
