import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { useConverterStore } from '../hooks/useConverterStore';
import { FileText, Download, Image, AlertTriangle } from 'lucide-react';

export function ExportForm() {
  const { 
    fileName, 
    setFileName, 
    removeInvalidLinks, 
    setRemoveInvalidLinks, 
    downloadThumbnails, 
    setDownloadThumbnails, 
    isExporting,
    exportToFile,
    urls
  } = useConverterStore();
  
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (urls.length === 0) {
      toast.error('No URLs to export');
      return;
    }

    if (!fileName) {
      toast.error('Please enter a file name');
      return;
    }

    setLoading(true);

    try {
      const result = await exportToFile();
      
      if (result) {
        toast.success(`File exported successfully as ${result}.txt`);
      } else {
        toast.error('Failed to export file');
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      toast.error('An error occurred while exporting the file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full shadow-lg border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl font-bold">Exporting</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30 flex items-center space-x-2">
              <Checkbox 
                id="removeInvalidLinks" 
                checked={removeInvalidLinks}
                onCheckedChange={(checked: boolean | "indeterminate") => 
                  setRemoveInvalidLinks(checked === "indeterminate" ? false : checked)
                }
                disabled={isExporting}
                className="border-emerald-400 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="removeInvalidLinks"
                className="text-sm font-medium text-emerald-800 dark:text-emerald-300 cursor-pointer select-none flex items-center gap-1"
              >
                <AlertTriangle size={14} className="inline" />
                Remove invalid YouTube links
              </label>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30 flex items-center space-x-2">
              <Checkbox 
                id="downloadThumbnails" 
                checked={downloadThumbnails}
                onCheckedChange={(checked: boolean | "indeterminate") => 
                  setDownloadThumbnails(checked === "indeterminate" ? false : checked)
                }
                disabled={isExporting}
                className="border-emerald-400 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="downloadThumbnails"
                className="text-sm font-medium text-emerald-800 dark:text-emerald-300 cursor-pointer select-none flex items-center gap-1"
              >
                <Image size={14} className="inline" />
                Download Thumbnails
              </label>
            </div>
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="File Name (No Need for .txt)"
              value={fileName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
              disabled={isExporting || loading}
              className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600"
            />
          </div>
          
          <Button 
            className="w-full h-12 text-lg transition-all bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold flex items-center justify-center gap-2 mt-4"
            onClick={handleExport}
            disabled={isExporting || loading || urls.length === 0}
          >
            <Download className="h-5 w-5" />
            {loading || isExporting ? 'Exporting...' : 'Export File'}
          </Button>
          
          {urls.length === 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Add links or load a playlist first
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 