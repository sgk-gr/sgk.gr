const fs = require('fs');
let content = fs.readFileSync('src/components/autopsia/AutopsiaView.tsx', 'utf8');

const regex = /                    <div className=\\
hidden
sm:flex
items-center
gap-1\\.5
px-3
py-1\\.5
bg-white
border-slate-200
shadow-xs
border
rounded-full
text-sm
font-medium
text-slate-700\\>[\\s\\S]*?<\\/div>/;

const replace = '                    <div className=\\hidden
sm:flex
items-center
gap-1.5
px-3
py-1.5
bg-white
border-slate-200
shadow-xs
border
rounded-full
text-sm
font-medium
text-slate-700\\>\\n                        <Users className=\\h-4
w-4
text-blue-600\\ />\\n                        <span>{customers?.length || 0} Κτήρια</span>\\n                    </div>\\n\\n                    <Button \\n                        onClick={() => setShowEngineerSigSetup(true)}\\n                        variant=\\outline\\\\n                        className=\\h-9
px-3
rounded-xl
flex
items-center
gap-1.5
border-slate-200
bg-white
text-slate-700
hover:bg-slate-50
cursor-pointer\\\\n                    >\\n                        <PenLine className=\\h-4
w-4
text-blue-500\\ />\\n                        <span className=\\hidden
sm:inline\\>Υπογραφή Τεχνικού</span>\\n                    </Button>\\n                    <Button \\n                        onClick={() => { localStorage.removeItem(\\autopsia_engineer_signature\\); window.location.reload(); }}\\n                        variant=\\outline\\\\n                        className=\\h-9
w-9
p-0
rounded-xl
flex
items-center
justify-center
border-red-200
bg-red-50
text-red-600
hover:bg-red-100
cursor-pointer\\\\n                        title=\\Διαγραφή
Υπογραφής
Τεχνικού\\\\n                    >\\n                        <Trash2 className=\\h-4
w-4\\ />\\n                    </Button>';

content = content.replace(regex, replace);
fs.writeFileSync('src/components/autopsia/AutopsiaView.tsx', content);
