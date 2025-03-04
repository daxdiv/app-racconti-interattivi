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
import { Check, Edit, Eye, X } from "lucide-react";
import { Node, useReactFlow } from "@xyflow/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
// import { DevTool } from "@hookform/devtools";
import { Form } from "@/components/ui/form";
import type { PageSchema } from "@/lib/zod";
import PageTab from "@/components/ui/nodes/doublePage/edit/pageTab";
import Preview from "@/components/ui/nodes/doublePage/preview";
import QuestionChoiceTab from "@/components/ui/nodes/doublePage/edit/questionChoiceTab";
import toast from "react-hot-toast";
import { truncate } from "@/lib/utils";
import useFlow from "@/hooks/useFlow";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useState } from "react";

type EditDialogProps = {
  id: string;
};

function EditDialog({ id }: EditDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { flowId } = useParams();
  const { save } = useFlow();
  const { getNodes, getEdges, getViewport, updateNodeData } =
    useReactFlow<Node<PageSchema>>();
  const form = useFormContext<PageSchema>();
  const formType = form.watch("type");

  const onSubmit = (values: PageSchema) => {
    updateNodeData(id, () => {
      toast.promise(
        save.mutateAsync({
          nodes: getNodes().map(n => {
            if (n.id === id) {
              return { ...n, data: values };
            }

            return n;
          }),
          edges: getEdges(),
          viewport: getViewport(),
          flowId: flowId!,
        }),
        {
          loading: "Salvataggio in corso...",
          success: ({ message }) => message,
          error: ({ message }) => `Errore salvataggio racconto (${message})`,
        }
      );

      return values;
    });
    setAlertDialogOpen(false);

    // toast.success("Modifiche salvate");
  };

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={setAlertDialogOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          className="w-1/2"
          variant="outline"
        >
          <Edit
            className="mr-2"
            size={16}
          />{" "}
          Modifica
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-4xl w-full"
        onEscapeKeyDown={e => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between items-center gap-x-1">
            Modifica "{truncate(form.getValues("label"), 12)}"
            {!form.formState.isValid && (
              <p className="text-destructive text-sm">Compila tutti i campi</p>
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <Form {...form}>
          <form
            className="space-y-2"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Tabs defaultValue="page">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="page">Pagine</TabsTrigger>
                <TabsTrigger value="question">Domanda</TabsTrigger>
                <TabsTrigger value="choice">Scelta</TabsTrigger>
              </TabsList>

              <TabsContent
                value="page"
                className="h-[640px]"
              >
                <PageTab />
              </TabsContent>
              <TabsContent
                value="question"
                className="h-[640px]"
              >
                <QuestionChoiceTab
                  field="question"
                  disabled={formType === "choice"}
                  onCheckedChange={e => {
                    form.setValue("type", e ? "question" : "base");
                  }}
                />
              </TabsContent>
              <TabsContent
                value="choice"
                className="h-[640px]"
              >
                <QuestionChoiceTab
                  field="choice"
                  disabled={formType === "question"}
                  onCheckedChange={e => {
                    form.setValue("type", e ? "choice" : "base");
                  }}
                />
              </TabsContent>
            </Tabs>

            <AlertDialogFooter className="flex justify-between sm:justify-between items-center w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive-outline">
                    <X
                      size={16}
                      className="mr-2"
                    />
                    Annulla
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Uscire senza salvare?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Le modifiche non salvate andranno perse
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/70 dark:bg-destructive hover:dark:bg-destructive-foreground"
                      onClick={() => {
                        setAlertDialogOpen(false);

                        form.reset();
                      }}
                    >
                      Si
                    </AlertDialogAction>
                    <AlertDialogCancel asChild>
                      <Button
                        variant="outline"
                        className="border-primary"
                      >
                        No
                      </Button>
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex justify-center items-center gap-x-2">
                <Preview
                  trigger={
                    <Button
                      variant="outline"
                      className="border-primary"
                    >
                      <Eye
                        className="mr-2"
                        size={16}
                      />{" "}
                      Anteprima
                    </Button>
                  }
                />
                <Button
                  type="submit"
                  className="bg-confirm dark:bg-confirm text-primary-foreground hover:bg-confirm-foreground dark:hover:bg-confirm-foreground flex justify-center items-center"
                  disabled={form.formState.isSubmitting}
                >
                  <Check
                    size={16}
                    className="mr-2"
                  />
                  Conferma
                </Button>
              </div>
            </AlertDialogFooter>
          </form>
        </Form>

        {/* {import.meta.env.DEV && <DevTool control={form.control} />} */}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditDialog;
