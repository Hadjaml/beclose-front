import { EmptyState } from "@/shared/ui/states";

export function ConversationsEmptyState() {
  return (
    <EmptyState
      title="Aucune conversation pour le moment"
      description="Les réponses des prospects apparaîtront ici lorsque les prises de contact seront actives."
    />
  );
}
