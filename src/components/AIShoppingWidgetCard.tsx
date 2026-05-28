// AIShoppingWidgetCard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface AIShoppingWidgetCardProps {
  userId: string;
  profileData: any;
  hideHeader?: boolean;
}

export const AIShoppingWidgetCard: React.FC<AIShoppingWidgetCardProps> = ({
  userId,
  profileData,
  hideHeader = false
}) => {
  const { t, i18n } = useTranslation();
  const isEl = i18n.language.startsWith('el');

  const [eshopUrl, setEshopUrl] = useState('');
  const [widgetName, setWidgetName] = useState('');
  const [widgetWelcome, setWidgetWelcome] = useState('');

  useEffect(() => {
    if (profileData) {
      setEshopUrl(profileData.eshop_url || '');
    }
  }, [profileData]);

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center gap-2 text-white">
          {isEl ? 'Live AI Shopping Widget στο Eshop σας' : 'Live AI Shopping Widget'}
          <Badge className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            {isEl ? 'Νέο' : 'New'}
          </Badge>
        </h4>
        <p className="text-xs text-neutral-400 font-sans leading-relaxed">
          {isEl 
            ? 'Προσαρμόστε την εμφάνιση του widget και αντιγράψτε τον κώδικα για να τον τοποθετήσετε στο footer του eshop σας (π.χ. στο WooCommerce ή στο Shopify).' 
            : 'Customize your widget appearance and copy the generated script tag to embed it in your store footer.'}
        </p>

        {/* Dynamic Customizers UI panel with Live Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          {/* Customizer Settings - Left (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Identity Inputs */}
            <div className="space-y-4 p-4 bg-neutral-900/40 rounded-xl border border-neutral-800/80">
              <div className="space-y-1.5">
                <Label className="text-neutral-400 text-xs">{isEl ? 'Όνομα AI Assistant' : 'Agent Name'}</Label>
                <Input 
                  type="text" 
                  value={widgetName} 
                  placeholder="Βοηθός AI"
                  onChange={(e) => setWidgetName(e.target.value)} 
                  className="text-xs h-9 bg-neutral-900 border-neutral-850 text-white placeholder-neutral-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-neutral-400 text-xs">{isEl ? 'Μήνυμα Καλωσορίσματος' : 'Welcome Message'}</Label>
                <Input 
                  type="text" 
                  value={widgetWelcome} 
                  placeholder="Γεια σας! Πώς μπορώ να βοηθήσω;"
                  onChange={(e) => setWidgetWelcome(e.target.value)} 
                  className="text-xs h-9 bg-neutral-900 border-neutral-850 text-white placeholder-neutral-600"
                />
              </div>
            </div>
          </div>

          {/* Real-time Visual Chat Widget Mockup - Right (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <Label className="text-neutral-450 text-xs mb-2 block">{isEl ? 'Ζωντανή Προεπισκόπηση Σχεδίου' : 'Live Design Preview'}</Label>
            
            <div className="border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px] w-full bg-[#f8fafc] text-neutral-850 font-sans">
              {/* Live Header */}
              <div className="p-3 border-b border-neutral-200 flex items-center justify-between bg-white/90 backdrop-blur-md">
                <div className="w-8 h-8 border border-neutral-200 rounded-lg flex items-center justify-center bg-white text-neutral-500">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-xs flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  <span>✨</span> {widgetName || "Βοηθός AI"}
                </h4>
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">×</div>
              </div>
              
              {/* Live Body / Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col bg-[#f8fafc]" style={{ scrollbarWidth: 'thin' }}>
                {/* Welcome Bubble */}
                <div className="p-3 rounded-2xl rounded-bl-sm text-[12px] max-w-[85%] border border-neutral-200 bg-white text-neutral-800 shadow-sm leading-relaxed self-start">
                  {widgetWelcome || "Γεια σας! Πώς μπορώ να βοηθήσω;"}
                </div>
                
                {/* Customer Bubble Mockup (Clothing Shop context!) */}
                <div className="p-3 rounded-2xl rounded-br-sm text-[12px] max-w-[85%] self-end bg-[#1e293b] text-white leading-relaxed">
                  {isEl ? 'Ψάχνω για ένα κομψό καλοκαιρινό φόρεμα' : 'I am looking for a stylish summer dress'}
                </div>

                {/* AI Response Mockup */}
                <div className="p-3 rounded-2xl rounded-bl-sm text-[12px] max-w-[85%] border border-neutral-200 bg-white text-neutral-800 shadow-sm leading-relaxed self-start">
                  {isEl ? 'Προτείνουμε τις εξής εξαιρετικές επιλογές από τη νέα μας συλλογή:' : 'We recommend the following premium options from our new collection:'}
                </div>

                {/* Product Carousel Mockup (Skroutz-style Premium Clothing Cards!) */}
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
                  {/* Dress Card */}
                  <div className="flex-shrink-0 w-[155px] bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="relative h-[115px] bg-[#fff0f3] flex items-center justify-center border-b border-neutral-100 p-2">
                      <span className="text-4xl filter drop-shadow-md">👗</span>
                      <div className="absolute bottom-1.5 right-1.5 bg-[#f55139] text-[8px] font-bold px-2 py-0.5 rounded-full text-white shadow-md">Δες το</div>
                    </div>
                    <div className="p-2 flex flex-col flex-1 justify-between min-h-[60px]">
                      <h5 className="font-bold text-[10px] text-neutral-800 line-clamp-1">Floral Summer Dress</h5>
                      <div className="flex flex-col mt-1">
                        <span className="text-[#f55139] text-[8px] font-semibold">★ 4.8</span>
                        <span className="font-extrabold text-[10px] text-emerald-600">από 39,90 €</span>
                      </div>
                    </div>
                  </div>

                  {/* Shirt Card */}
                  <div className="flex-shrink-0 w-[155px] bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="relative h-[115px] bg-[#f0f4ff] flex items-center justify-center border-b border-neutral-100 p-2">
                      <span className="text-4xl filter drop-shadow-md">👚</span>
                      <div className="absolute bottom-1.5 right-1.5 bg-[#f55139] text-[8px] font-bold px-2 py-0.5 rounded-full text-white shadow-md">Δες το</div>
                    </div>
                    <div className="p-2 flex flex-col flex-1 justify-between min-h-[60px]">
                      <h5 className="font-bold text-[10px] text-neutral-800 line-clamp-1">Linen Casual Shirt</h5>
                      <div className="flex flex-col mt-1">
                        <span className="text-[#f55139] text-[8px] font-semibold">★ 4.9</span>
                        <span className="font-extrabold text-[10px] text-emerald-600">από 29,90 €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Footer / Input */}
              <div className="p-2.5 border-t border-neutral-200 flex items-center gap-2 bg-white">
                <div className="flex-1 h-9 rounded-full border border-neutral-200 px-3 text-[11px] text-neutral-450 flex items-center bg-white">
                  {isEl ? 'Γράψτε το μήνυμά σας...' : 'Write your message...'}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f55139] flex-shrink-0 shadow-md">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </div>
              </div>
              
              {/* Live Branding */}
              <div className="text-[8px] text-center pb-1.5 pt-1 border-t border-neutral-100 bg-white text-neutral-400">
                Powered by <span className="font-semibold text-neutral-500">SigmaLabs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic script generator output - VERSION 2.2! */}
        <div className="space-y-1.5 mt-4">
          <Label className="text-neutral-400 text-xs">{isEl ? 'Κώδικας Ενσωμάτωσης' : 'Embed Code'}</Label>
          <div className="flex items-center gap-2">
            <Input
              value={`<script src="https://sgk.gr/sigmalabs-chat.js?v=2.2" data-shop="${eshopUrl || 'your-store.com'}" data-token="${userId}" data-name="${widgetName || 'Βοηθός AI'}" data-welcome="${widgetWelcome || 'Γεια σας! Πώς μπορώ να βοηθήσω;'}" defer></script>`}
              readOnly
              className="font-mono text-xs bg-neutral-900 border-neutral-800 text-white select-all h-10"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="border-neutral-800 hover:bg-neutral-800 text-white h-10 px-3" 
              onClick={() => {
                const finalCode = `<script src="https://sgk.gr/sigmalabs-chat.js?v=2.2" data-shop="${eshopUrl || 'your-store.com'}" data-token="${userId}" data-name="${widgetName || 'Βοηθός AI'}" data-welcome="${widgetWelcome || 'Γεια σας! Πώς μπορώ να βοηθήσω;'}" defer></script>`;
                navigator.clipboard.writeText(finalCode);
                toast({
                  title: isEl ? 'Αντιγράφηκε!' : 'Copied!',
                  description: isEl ? 'Ο κώδικας του widget αντιγράφηκε στο πρόχειρο.' : 'Widget code copied to clipboard.'
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="border-neutral-800/60 my-6" />

      {/* How it Works */}
      <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-900/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-white mb-1.5 font-serif">
              {isEl ? 'Πώς λειτουργεί' : 'How it works'}
            </h4>
            <p className="text-xs text-blue-300 leading-relaxed font-sans">
              {isEl 
                ? 'Τοποθετήστε το script tag στο footer ή στο head της ιστοσελίδας σας. Ο βοηθός AI θα εμφανιστεί αυτόματα στην κάτω δεξιά γωνία και θα προσφέρει στους επισκέπτες σας μια μοναδική εμπειρία εύρεσης προϊόντων.' 
                : 'Place the script tag in your store footer or head section. The AI assistant will automatically appear in the bottom-right corner and offer your visitors an outstanding product discovery experience.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
