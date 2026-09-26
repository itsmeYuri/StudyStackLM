import { QuizPlayer } from "@/components/quiz-player";
export default async function Attempt({ params }: { params: Promise<{ materialId: string }> }) { const { materialId } = await params; return <QuizPlayer materialId={materialId}/>; }
