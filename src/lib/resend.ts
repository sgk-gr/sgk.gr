/**
 * Στέλνει τα στοιχεία επικοινωνίας μέσω Supabase Edge Function
 */
export const sendContactEmail = async (formData: any) => {
    // Το URL της Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        throw new Error("Η υπηρεσία επικοινωνίας δεν είναι ακόμα έτοιμη.");
    }

    try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Αποτυχία αποστολής email");
        }

        return result;
    } catch (error) {
        console.error("Error calling edge function:", error);
        throw error;
    }
};
