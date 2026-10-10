import { supabaseAutopsia } from "./supabase";

export const logComment = async (
  customerId: string,
  userEmail: string | undefined,
  commentText: string,
  sourcePage: string
) => {
  if (!commentText || commentText.trim() === "") return;

  try {
    const { error } = await supabaseAutopsia.from("customer_comments").insert({
      customer_id: customerId,
      user_email: userEmail || "Άγνωστος Χρήστης",
      comment_text: commentText.trim(),
      source_page: sourcePage,
    });

    if (error) {
      console.error("Error logging comment:", error);
    }
  } catch (e) {
    console.error("Failed to log comment:", e);
  }
};
