import { NextRequest, NextResponse } from "next/server";

// Λίστα πόλεων και κλάδων για αυτόματο καθημερινό σκανάρισμα
const CITIES = ["Καστοριά", "Κοζάνη", "Φλώρινα", "Γρεβενά", "Πτολεμαΐδα", "Βέροια", "Έδεσσα", "Νάουσα", "Κατερίνη", "Ιωάννινα"];
const INDUSTRIES = [
  "ξενοδοχεία", 
  "ενοικιαζόμενα δωμάτια", 
  "ταβέρνα", 
  "εστιατόριο", 
  "κομμωτήριο", 
  "έπιπλα", 
  "ζαχαροπλαστείο", 
  "οικοδομικές εργασίες", 
  "γυμναστήριο", 
  "κρεοπωλείο",
  "ανθοπωλείο",
  "συνεργείο αυτοκινήτων"
];

export async function GET(req: NextRequest) {
  try {
    // Έλεγχος ασφαλείας (π.χ. Token εξουσιοδότησης από το Cron Job)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Αν έχει οριστεί μυστικό, το ελέγχουμε
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Επιλογή τυχαίας πόλης και κλάδου με βάση την τρέχουσα ημέρα/ώρα για να μην κάνουμε τα ίδια
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomIndustry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];

    console.log(`Cron Scraper Triggered: Scanning for '${randomIndustry}' in '${randomCity}'`);

    // Καλούμε το δικό μας API endpoint στέλνοντας POST αίτημα
    // Χρησιμοποιούμε το origin του τρέχοντος request για να καλέσουμε το σωστό URL
    const { origin } = new URL(req.url);
    const scraperUrl = `${origin}/api/scraper`;

    const res = await fetch(scraperUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        city: randomCity,
        industry: randomIndustry
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Scraper API returned error: ${errorText}`);
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      message: "Automated daily scrape completed successfully",
      scanned: {
        city: randomCity,
        industry: randomIndustry
      },
      details: data
    });

  } catch (error: any) {
    console.error("Cron Scraper Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
