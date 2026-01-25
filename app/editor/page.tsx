import { Suspense } from "react";
import { EditorPage } from "@/components/editor-page";

export default function EditorRoute() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <EditorPage />
    </Suspense>
  );
}
