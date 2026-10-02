/* eslint-disable @next/next/no-img-element */
"use client";

import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  LuFileText,
  LuExternalLink,
  LuPencil,
  LuTrash2,
  LuSparkles,
} from "react-icons/lu";
import { formatArticleDate } from "@/lib/utils/date";
import type { Article, ArticleStatus } from "@/lib/articles/types";

interface ArticlesTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onToggleStatus: (id: string, newStatus: ArticleStatus) => void;
  onDelete: (id: string) => void;
  onResetFilters: () => void;
  isRtl: boolean;
}

export function ArticlesTable({
  articles,
  onEdit,
  onToggleStatus,
  onDelete,
  onResetFilters,
  isRtl,
}: ArticlesTableProps) {
  if (articles.length === 0) {
    return (
      <EmptyState
        icon={<LuFileText className="w-6 h-6 text-muted-foreground" />}
        title={isRtl ? "لم يتم العثور على مقالات" : "No Articles Found"}
        description={
          isRtl
            ? "لم تطابق أي مقالات خيارات البحث أو التصفية المحددة."
            : "No articles matched your active search query or filter selection."
        }
        action={
          <Button variant="outline" size="sm" onClick={onResetFilters} className="rounded-xl">
            {isRtl ? "إعادة تعيين الفلاتر" : "Reset Filters"}
          </Button>
        }
      />
    );
  }

  return (
    <Card className="border border-border/80 overflow-hidden rounded-2xl shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
              <th className="py-3 px-4 text-start">{isRtl ? "المقال والمسار" : "Article & Slug"}</th>
              <th className="py-3 px-4 text-start hidden md:table-cell">{isRtl ? "التصنيف" : "Category"}</th>
              <th className="py-3 px-4 text-start">{isRtl ? "الحالة" : "Status"}</th>
              <th className="py-3 px-4 text-start hidden lg:table-cell">{isRtl ? "الكاتب والوقت" : "Author & Read"}</th>
              <th className="py-3 px-4 text-end">{isRtl ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {articles.map((article) => {
              const isPublished = article.status === "published";
              const title = isRtl ? article.titleAr : article.titleEn;

              return (
                <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                  {/* Title & Slug */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary overflow-hidden">
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        ) : article.layoutVariant === "featured" ? (
                          <LuSparkles className="w-4 h-4 text-amber-500" />
                        ) : (
                          <LuFileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm truncate">
                            {title}
                          </span>
                          {article.layoutVariant === "featured" && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
                              {isRtl ? "مميز" : "Featured"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded truncate">
                            /blog/{article.slug}
                          </code>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Tags */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[11px] capitalize border-border">
                        {article.category}
                      </Badge>
                      {article.tags.length > 0 && (
                        <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                          {article.tags.slice(0, 2).join(", ")}
                          {article.tags.length > 2 && "..."}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Badge & Quick Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() =>
                        onToggleStatus(article.id, isPublished ? "draft" : "published")
                      }
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                        isPublished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      }`}
                      title={isRtl ? "انقر للتبديل بين النشر والمسودة" : "Click to toggle Publish/Draft"}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <span>{isPublished ? (isRtl ? "منشور" : "Published") : (isRtl ? "مسودة" : "Draft")}</span>
                    </button>
                  </td>

                  {/* Author & Read Time / Published Date */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      {article.authorAvatar && (
                        <img
                          src={article.authorAvatar}
                          alt={article.authorName}
                          className="w-5 h-5 rounded-full object-cover border border-border/60 shrink-0"
                        />
                      )}
                      <span className="text-foreground font-medium text-xs">
                        {article.authorName}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {article.publishedAt
                        ? formatArticleDate(article.publishedAt, isRtl ? "ar" : "en")
                        : (isRtl ? article.readTimeAr : article.readTimeEn)}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1">
                      {/* View live article */}
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title={isRtl ? "معاينة على الموقع" : "Preview on Live Site"}
                      >
                        <LuExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit article button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(article)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                        title={isRtl ? "تعديل المقال" : "Edit Article"}
                      >
                        <LuPencil className="w-3.5 h-3.5" />
                      </Button>

                      {/* Delete article button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(article.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 cursor-pointer rounded-lg"
                        title={isRtl ? "حذف المقال" : "Delete Article"}
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
