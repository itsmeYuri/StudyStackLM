import { AuthForm } from "@/components/auth-form";
import { signIn } from "../actions";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const { error } = await searchParams; return <AuthForm mode="login" action={signIn} error={error}/>; }
