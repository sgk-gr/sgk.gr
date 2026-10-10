import React, { useEffect, useState } from 'react';
import { getTimestampedUrl } from "@/lib/autopsia/utils";
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExcelViewerProps {
  url: string;
}

export const ExcelViewer: React.FC<ExcelViewerProps> = ({ url }) => {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const targetUrl = getTimestampedUrl(url);
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Failed to fetch file');
        
        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        if (wb.SheetNames.length > 0) {
          const firstSheet = wb.SheetNames[0];
          setActiveSheet(firstSheet);
          const jsonData = XLSX.utils.sheet_to_json(wb.Sheets[firstSheet], { header: 1 }) as any[][];
          setSheetData(jsonData);
        }
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Σφάλμα κατά την ανάγνωση του αρχείου Excel. Βεβαιωθείτε ότι το αρχείο είναι έγκυρο.');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchExcel();
    }
  }, [url]);

  useEffect(() => {
    if (workbook && activeSheet) {
      const worksheet = workbook.Sheets[activeSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      setSheetData(jsonData);
    }
  }, [activeSheet, workbook]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-muted-foreground font-medium">Φόρτωση δεδομένων Excel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Σφάλμα</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full bg-slate-100">
      <Tabs value={activeSheet} onValueChange={setActiveSheet} className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
            <TabsList className="bg-slate-100/50 p-0.5 rounded-lg border h-auto flex-nowrap w-fit">
              {sheetNames.map((name) => (
                <TabsTrigger 
                  key={name} 
                  value={name}
                  className="px-3 py-1 text-[10px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all rounded"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-4 whitespace-nowrap bg-slate-50 px-2 py-1 rounded border">
            <FileSpreadsheet className="h-2.5 w-2.5 text-emerald-500" />
            {sheetNames.length} {sheetNames.length === 1 ? 'ΦΥΛΛΟ' : 'ΦΥΛΛΑ'}
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          <div className="p-4 min-w-max">
            <div className="rounded border bg-white shadow-sm inline-block min-w-full">
              <Table className="border-collapse">
                <TableHeader className="bg-slate-50/95 sticky top-0 z-30 border-b">
                  <TableRow className="hover:bg-transparent border-none">
                    {sheetData[0]?.map((cell: any, index: number) => (
                      <TableHead key={index} className="whitespace-nowrap font-black text-[10px] text-slate-800 border-r last:border-0 px-3 py-1.5 uppercase tracking-tight h-7 bg-slate-50 shadow-[0_1px_0_rgba(0,0,0,0.1)]">
                        {cell || `Col ${index + 1}`}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheetData.length <= 1 ? (
                    <TableRow>
                      <TableCell colSpan={sheetData[0]?.length || 1} className="h-24 text-center text-muted-foreground italic text-[10px]">
                        Δεν υπάρχουν δεδομένα σε αυτό το φύλλο.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sheetData.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="hover:bg-emerald-50/30 transition-colors border-b last:border-0 h-6 group">
                        {row.map((cell: any, cellIndex: number) => (
                          <TableCell key={cellIndex} className="whitespace-nowrap border-r last:border-0 px-3 py-1 text-slate-600 text-[10px] font-medium leading-none">
                            {cell}
                          </TableCell>
                        ))}
                        {/* Fill missing cells */}
                        {Array.from({ length: Math.max(0, (sheetData[0]?.length || 0) - row.length) }).map((_, i) => (
                          <TableCell key={`empty-${i}`} className="border-r last:border-0 whitespace-nowrap" />
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};
