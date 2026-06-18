const run = async () => {
  const response = await fetch("https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-nurture-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: 999 })
  });
  const data = await response.json();
  const models = data.models ? data.models.map(m => m.name).join("\n") : JSON.stringify(data);
  console.log(models);
};
run();
