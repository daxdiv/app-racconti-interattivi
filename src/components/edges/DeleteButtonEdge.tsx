import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from "@xyflow/react";

import useEdgeUtils from "@/hooks/useEdgeUtils";

function DeleteButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { onEdgeDelete } = useEdgeUtils();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 16,
            pointerEvents: "all",
          }}
          className="nodrag nopan absolute flex justify-center"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-[20px] h-[20px] text-secondary bg-destructive cursor-pointer rounded-full leading-none pb-[0.12rem]">
                ×
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminare il collegamento?</AlertDialogTitle>
                <AlertDialogDescription />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    onEdgeDelete(id);
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
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default DeleteButtonEdge;
