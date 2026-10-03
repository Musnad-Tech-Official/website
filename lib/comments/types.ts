export interface ArticleComment {
  id: string;
  articleId?: string;
  articleSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: "member" | "author" | "admin" | "team";
  content: string;
  status: "approved" | "pending" | "flagged" | "deleted";
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: ArticleComment[];
}

export interface AddCommentParams {
  articleId?: string;
  articleSlug: string;
  content: string;
  parentId?: string;
}

export interface CommentActionResult {
  success: boolean;
  comment?: ArticleComment;
  error?: string;
}

export interface ArticleCommentDbRow {
  id: string;
  article_id?: string;
  article_slug: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_role: string;
  content: string;
  status: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}
