import { AuthForm } from "@/components/auth-form";
import { signUp } from "../actions";
export default async function Signup({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const { error } = await searchParams; return <AuthForm mode="signup" action={signUp} error={error}/>; }
