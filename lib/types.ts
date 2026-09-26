export type GroupSummary = { id: string; name: string; subject: string; description: string | null; created_at: string };
export type SourceSummary = { id: string; title: string; status: string; page_count: number | null; created_at: string; error_code: string | null };
export type MaterialSummary = { id: string; group_id: string; title: string; description: string | null; type: string; status: string; content: unknown; updated_at: string };
export type MemberSummary = { user_id: string; role: string; joined_at: string; profiles: { display_name: string; avatar_url: string | null } | null };
