/**
 * Στέλνει τα στοιχεία επικοινωνίας μέσω Supabase Edge Function
 */
export const sendContactEmail = async (email: string, phone: string, offerPrice?: number) => {
    // Το URL της Supabase Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (import.meta.env as any).SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env as any).SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
        throw new Error("Η υπηρεσία επικοινωνίας δεν είναι ακόμα έτοιμη. Προσθέστε το Supabase URL και Key.");
    }

    try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({ email, phone, offerPrice }),
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
