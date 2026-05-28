// ChatGPTCommerceCard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Search,
  BarChart3,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ChatGPTCommerceCardProps {
  userId: string;
  profileData: any;
  hideHeader?: boolean;
}

export const ChatGPTCommerceCard: React.FC<ChatGPTCommerceCardProps> = ({
  userId,
  profileData,
  hideHeader = false
}) => {
  const { t, i18n } = useTranslation();
  const isEl = i18n.language.startsWith('el');

  const [acpEnabled, setAcpEnabled] = useState(false);
  const [openaiEndpoint, setOpenaiEndpoint] = useState('');
  const [openaiAuthToken, setOpenaiAuthToken] = useState('');
  const [eshopUrl, setEshopUrl] = useState('');
  const [widgetColor, setWidgetColor] = useState('#10b981');
  const [widgetName, setWidgetName] = useState('');
  const [widgetWelcome, setWidgetWelcome] = useState('');
  const [widgetHeaderBg, setWidgetHeaderBg] = useState('#0b0f19');
  const [widgetHeaderColor, setWidgetHeaderColor] = useState('#ffffff');
  const [widgetBodyBg, setWidgetBodyBg] = useState('#0b0f19');
  const [widgetBodyColor, setWidgetBodyColor] = useState('#cbd5e1');
  const [widgetInputBg, setWidgetInputBg] = useState('#0f172a');
  const [widgetInputColor, setWidgetInputColor] = useState('#ffffff');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const extractStoreName = (url: string): string => {
    try {
      const cleanUrl = url.trim().startsWith('http') ? url.trim() : 'https://' + url.trim();
      const domain = new URL(cleanUrl).hostname.replace('www.', '');
      return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    } catch {
      return 'Store';
    }
  };
  const storeName = extractStoreName(eshopUrl);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    clickThroughRate: 0,
    productsIndexed: 0,
    lastSync: null as Date | null
  });

  useEffect(() => {
    loadACPStatus();
  }, [userId]);

  useEffect(() => {
    if (acpEnabled && openaiEndpoint && openaiAuthToken) {
      const interval = setInterval(() => {
        loadStats();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [acpEnabled, openaiEndpoint, openaiAuthToken]);

  const loadACPStatus = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Type assertion for extended profile fields not in generated types
      const profileData = data as any;
      setAcpEnabled(profileData?.acp_enabled || false);
      setOpenaiEndpoint(profileData?.openai_endpoint || '');
      setOpenaiAuthToken(profileData?.openai_auth_token || '');
      setEshopUrl(profileData?.eshop_url || '');

      if (profileData?.acp_enabled && profileData?.openai_endpoint && profileData?.openai_auth_token) {
        await loadStats();
      }
    } catch (err: any) {
      toast({
        title: 'Σφάλμα',
        description: err.message || 'Αποτυχία φόρτωσης κατάστασης ChatGPT Commerce',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('eshop_url, woocommerce_ck, woocommerce_sk, shopify_access_token')
        .eq('user_id', userId)
        .single();

      if (profile?.eshop_url) {
        setEshopUrl(profile.eshop_url);
      }

      let totalProducts = 0;
      if (profile?.woocommerce_ck || profile?.shopify_access_token) {
        try {
          const { data: countData, error: countError } = await supabase.functions.invoke('get-top-products', {
            body: { user_id: userId, count_only: true }
          });
          if (!countError && countData) {
            totalProducts = countData.total_products || 0;
          }
        } catch (err) {
          console.warn('Failed to fetch product count via Edge Function:', err);
        }
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Use type assertion for tables not in generated types
      const { data: logsData } = await (supabase as any)
        .from('acp_logs')
        .select('status_code, created_at')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const logs = logsData as any[] || [];
      const totalViews = logs.length;
      const successfulViews = logs.filter((l: any) => l.status_code === 200).length;
      const clickThroughRate = totalViews > 0 ? (successfulViews / totalViews) * 100 : 0;
      const lastSync = logs[0] ? new Date(logs[0].created_at) : null;

      setStats({
        totalProducts,
        totalViews,
        clickThroughRate,
        productsIndexed: successfulViews > 0 ? totalProducts : 0,
        lastSync
      });
    } catch (err) {
      console.warn('Stats load failed:', err);
    }
  };

  const handleToggleACP = async (enabled: boolean) => {
    if (enabled && (!openaiEndpoint || !openaiAuthToken)) {
      toast({
        title: 'Λείπουν Στοιχεία',
        description: 'Συμπληρώστε πρώτα το OpenAI endpoint και auth token',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ acp_enabled: enabled })
        .eq('user_id', userId);

      if (error) throw error;

      setAcpEnabled(enabled);
      toast({
        title: enabled ? t('chatgptCommerce.enableTitle') : 'ChatGPT Commerce Απενεργοποιήθηκε',
        description: enabled
          ? 'Τα προϊόντα σου αποστέλλονται αυτόματα στο ChatGPT κάθε 15 λεπτά'
          : 'Η αυτόματη αποστολή σταμάτησε'
      });

      if (enabled) await loadStats();
    } catch (err: any) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ενημέρωσης κατάστασης',
        variant: 'destructive'
      });
      setAcpEnabled(!enabled);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCredentials = async () => {
    if (!openaiEndpoint.trim() || !openaiAuthToken.trim()) {
      toast({
        title: 'Σφάλμα',
        description: 'Και τα δύο πεδία είναι υποχρεωτικά',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          openai_endpoint: openaiEndpoint.trim(),
          openai_auth_token: openaiAuthToken.trim()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Στοιχεία Αποθηκεύτηκαν',
        description: 'Η ενσωμάτωση OpenAI ρυθμίστηκε επιτυχώς'
      });
    } catch (err) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία αποθήκευσης στοιχείων',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
    toast({
      title: 'Στατιστικά Ενημερώθηκαν',
      description: 'Φορτώθηκαν τα πιο πρόσφατα δεδομένα'
    });
  };

  // TRANSFORM TO OPENAI SPEC (ίδια με Edge Function)
  const transformToOpenAISpec = async (
    products: any[],
    eshopUrl: string,
    connector: any
  ): Promise<any[]> => {
    const records: any[] = [];

    const stripHtml = (html: string = ""): string => {
      return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
    };

    const extractBrand = (p: any): string => {
      const attr = p.attributes?.find((a: any) =>
        ["brand", "manufacturer", "pa_brand"].includes(a.name.toLowerCase())
      );
      return attr?.options?.[0] || "";
    };

    const extractSellerName = (url: string): string => {
      try {
        const domain = new URL(url).hostname.replace("www.", "");
        return domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);
      } catch {
        return "My Store";
      }
    };

    const extractMaterial = (p: any): string => {
      const attr = p.attributes?.find((a: any) =>
        a.name.toLowerCase().includes("material") || a.name.toLowerCase().includes("fabric")
      );
      if (attr?.options?.[0]) return attr.options[0];

      const desc = (p.description || p.short_description || "").toLowerCase();
      const keywords = ["cotton", "polyester", "leather", "wool", "silk", "nylon", "metal", "plastic", "wood"];
      for (const kw of keywords) {
        if (desc.includes(kw)) return kw.charAt(0).toUpperCase() + kw.slice(1);
      }
      return "Various";
    };

    const extractWeight = (p: any): string => {
      return p.weight ? `${p.weight} kg` : "1 kg";
    };

    for (const p of products) {
      const base = {
        enable_search: true,
        enable_checkout: false,
        id: p.id.toString(),
        title: p.name.trim(),
        description: stripHtml(p.description || p.short_description || "") || "No description available",
        link: p.permalink,
        image_link: p.images?.[0]?.src || "",
        additional_image_link: p.images?.slice(1)?.map((i: any) => i.src).join(",") || "",
        price: `${parseFloat(p.price || "0").toFixed(2)} EUR`,
        sale_price: p.sale_price ? `${parseFloat(p.sale_price).toFixed(2)} EUR` : undefined,
        availability: p.stock_status === "instock" ? "in_stock" : p.stock_status === "onbackorder" ? "preorder" : "out_of_stock",
        inventory_quantity: p.stock_quantity ?? 0,
        condition: "new",
        brand: extractBrand(p) || extractSellerName(eshopUrl),
        product_category: p.categories?.map((c: any) => c.name).join(" > ") || "General",
        weight: extractWeight(p),
        material: extractMaterial(p),
        seller_name: extractSellerName(eshopUrl),
        seller_url: eshopUrl,
        return_policy: `${eshopUrl.replace(/\/$/, "")}/returns-policy`,
        return_window: 30,
      };

      if (p.type === "variable") {
        const variations = await connector.getProductVariations(p.id.toString());

        for (const v of variations) {
          records.push({
            ...base,
            id: v.id.toString(),
            item_group_id: p.id.toString(),
            title: `${p.name} - ${v.attributes.map((a: any) => a.option).join(" ")}`.trim(),
            image_link: v.image?.src || p.images?.[0]?.src || "",
            price: `${parseFloat(v.price || p.price || "0").toFixed(2)} EUR`,
            sale_price: v.sale_price ? `${parseFloat(v.sale_price).toFixed(2)} EUR` : undefined,
            availability: v.stock_status === "instock" ? "in_stock" : "out_of_stock",
            inventory_quantity: v.stock_quantity ?? 0,
            color: v.attributes.find((a: any) => a.name.toLowerCase().includes("color"))?.option || "",
            size: v.attributes.find((a: any) => a.name.toLowerCase().includes("size"))?.option || "",
          });
        }

        records.push({ ...base });
      } else {
        records.push(base);
      }
    }

    return records;
  };

  const handleDownloadFeed = async () => {
    try {
      setSaving(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('eshop_url, woocommerce_ck, woocommerce_sk')
        .eq('user_id', userId)
        .single();

      if (!profile) throw new Error('Profile not found');

      const connector = {
        async fetchAllProducts() {
          const all: any[] = [];
          let page = 1;
          while (true) {
            const res = await fetch(
              `${profile.eshop_url}/wp-json/wc/v3/products?per_page=100&page=${page}&status=publish`,
              { headers: { Authorization: 'Basic ' + btoa(`${profile.woocommerce_ck}:${profile.woocommerce_sk}`) } }
            );
            if (!res.ok) break;
            const batch = await res.json();
            if (batch.length === 0) break;
            all.push(...batch);
            page++;
          }
          return all;
        },
        async getProductVariations(id: string) {
          const res = await fetch(
            `${profile.eshop_url}/wp-json/wc/v3/products/${id}/variations?per_page=100`,
            { headers: { Authorization: 'Basic ' + btoa(`${profile.woocommerce_ck}:${profile.woocommerce_sk}`) } }
          );
          return res.ok ? await res.json() : [];
        }
      };

      const products = await connector.fetchAllProducts();
      const records = await transformToOpenAISpec(products, profile.eshop_url, connector);

      const jsonl = records.map(r => JSON.stringify(r)).join('\n');
      const blob = new Blob([jsonl], { type: 'application/jsonl' });

      const compressedStream = new Blob([blob]).stream().pipeThrough(new CompressionStream('gzip'));
      const compressedBlob = await new Response(compressedStream).blob();

      const url = URL.createObjectURL(compressedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `openai-product-feed-${new Date().toISOString().slice(0, 10)}.jsonl.gz`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Το Feed Κατεβάστηκε',
        description: 'Το αρχείο προϊόντων αποθηκεύτηκε ως jsonl.gz'
      });
    } catch (err: any) {
      toast({
        title: 'Αποτυχία Κατεβάσματος',
        description: err.message || 'Δεν ήταν δυνατή η δημιουργία του αρχείου feed',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const maskToken = (token: string) => token ? token.slice(0, 8) + '...' + token.slice(-8) : '';

  const getStatusBadge = () => {
    if (!acpEnabled || !openaiEndpoint || !openaiAuthToken) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          {t('chatgptCommerce.status.pending', 'Σε Αναμονή')}
        </Badge>
      );
    }
    return (
      <Badge className="gap-1 bg-green-600 hover:bg-green-700">
        <CheckCircle2 className="h-3 w-3" />
        {t('chatgptCommerce.status.active', 'Ενεργό')}
      </Badge>
    );
  };

  if (loading) {
    if (hideHeader) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      );
    }
    return (
      <Card>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (hideHeader) {
    return (
      <div className="space-y-6 mt-2">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/40 rounded-xl border border-neutral-800">
          <div>
            <h4 className="font-semibold text-white">
              {t('chatgptCommerce.enableTitle', 'Ενεργοποίηση Πωλήσεων μέσω ChatGPT')}
            </h4>
            <p className="text-sm text-neutral-400 mt-0.5">
              {t('chatgptCommerce.enableDescription', 'Επιτρέψτε στους πελάτες να αγοράζουν μέσω ChatGPT')}
            </p>
          </div>
          <Switch
            checked={acpEnabled}
            onCheckedChange={handleToggleACP}
            disabled={saving || (!openaiEndpoint || !openaiAuthToken)}
          />
        </div>

        {/* OpenAI Credentials */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2 text-white">
            {t('chatgptCommerce.apiToken', 'API Access Token')}
            <Badge variant="outline" className="text-xs text-neutral-400 border-neutral-800">
              {t('chatgptCommerce.forOpenAI', 'Για OpenAI')}
            </Badge>
          </h4>

          <div className="space-y-3">
            <div>
              <Label className="text-neutral-450 text-xs block mb-1.5">{t('chatgptCommerce.feedUrl', 'Product Feed Endpoint')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={openaiEndpoint}
                  readOnly
                  className="font-mono text-xs bg-neutral-900 border-neutral-800 text-white"
                />
                <Button variant="outline" size="sm" className="border-neutral-850 hover:bg-neutral-800 text-white" onClick={() => navigator.clipboard.writeText(openaiEndpoint)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-neutral-455 text-xs block mb-1.5">OpenAI Auth Token</Label>
              <div className="flex items-center gap-2">
                <Input
                  type={showToken ? "text" : "password"}
                  value={openaiAuthToken}
                  readOnly
                  className="font-mono text-xs bg-neutral-900 border-neutral-800 text-white"
                />
                <Button variant="outline" size="sm" className="border-neutral-850 hover:bg-neutral-800 text-white" onClick={() => setShowToken(!showToken)}>
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" className="border-neutral-850 hover:bg-neutral-800 text-white" onClick={() => navigator.clipboard.writeText(openaiAuthToken)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {acpEnabled && openaiEndpoint && openaiAuthToken && (
          <>
            <Separator className="border-neutral-800" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-900/30">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingCart className="h-5 w-5 text-blue-400" />
                  <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-6 w-6 p-0 text-neutral-400 hover:text-white">
                    <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.totalProducts}
                </div>
                <div className="text-xs text-blue-400">
                  {t('chatgptCommerce.stats.totalProducts', 'Total Products')}
                </div>
              </div>

              <div className="p-4 bg-green-950/20 rounded-lg border border-green-900/30">
                <Eye className="h-5 w-5 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="text-xs text-green-400">
                  {t('chatgptCommerce.stats.views', 'Product Views')}
                </div>
              </div>

              <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-900/30">
                <TrendingUp className="h-5 w-5 text-purple-400 mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stats.clickThroughRate.toFixed(1)}%
                </div>
                <div className="text-xs text-purple-400">
                  {t('chatgptCommerce.stats.ctr', 'Success Rate')}
                </div>
              </div>

              <div className="p-4 bg-orange-950/20 rounded-lg border border-orange-900/30">
                <BarChart3 className="h-5 w-5 text-orange-400 mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stats.productsIndexed}
                </div>
                <div className="text-xs text-orange-400">
                  {t('chatgptCommerce.stats.indexed', 'Indexed')}
                </div>
              </div>
            </div>

            {stats.lastSync && (
              <p className="text-xs text-neutral-400 text-center">
                {t('chatgptCommerce.lastSynced', 'Last Sync')}: {stats.lastSync.toLocaleString()}
              </p>
            )}

            {/* Download Button */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleDownloadFeed}
                disabled={saving || refreshing}
                variant="outline"
                className="gap-2 border-neutral-800 text-white hover:bg-neutral-800"
              >
                <Download className="h-4 w-4" />
                {t('chatgptCommerce.downloadFeed', 'Download Product Feed (jsonl.gz)')}
              </Button>
            </div>

            {/* How it Works */}
            <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-900/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-white mb-1.5">
                    {isEl ? 'Πώς λειτουργεί' : 'How it works'}
                  </h4>
                  <p className="text-xs text-blue-300 leading-relaxed font-sans">
                    {isEl 
                      ? 'Τα προϊόντα σας αυτόματα διαβάζονται από όλα τα LLMs (Claude, ChatGPT, κτλπ.) μέσω του server του SigmaLabs και του αρχείου llms.txt.' 
                      : 'Your products are automatically read by all LLMs (Claude, ChatGPT, etc.) through the SigmaLabs server and the llms.txt file.'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-xl border-0 shadow-lg">
      <details className="group">
        <summary className="cursor-pointer list-none p-6 bg-purple-50/50 dark:bg-purple-950/20 border-b border-purple-200/30 dark:border-purple-800/20 hover:bg-muted/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  ChatGPT Product Discovery
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('chatgptCommerce.subtitle', 'Sell your products directly through ChatGPT')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge()}
              <div className="text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </summary>

        <div className="px-6 pb-6 space-y-6 mt-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
            <div>
              <h4 className="font-medium">
                {t('chatgptCommerce.enableTitle', 'Ενεργοποίηση Πωλήσεων μέσω ChatGPT')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('chatgptCommerce.enableDescription', 'Επιτρέψτε στους πελάτες να αγοράζουν μέσω ChatGPT')}
              </p>
            </div>
            <Switch
              checked={acpEnabled}
              onCheckedChange={handleToggleACP}
              disabled={saving || (!openaiEndpoint || !openaiAuthToken)}
            />
          </div>

          {/* OpenAI Credentials */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              {t('chatgptCommerce.apiToken', 'API Access Token')}
              <Badge variant="outline" className="text-xs">
                {t('chatgptCommerce.forOpenAI', 'Για OpenAI')}
              </Badge>
            </h4>

            <div className="space-y-3">
              <div>
                <Label>{t('chatgptCommerce.feedUrl', 'Product Feed Endpoint')}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={openaiEndpoint}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(openaiEndpoint)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

              </div>

              <div>
                <Label>OpenAI Auth Token</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showToken ? "text" : "password"}
                    value={openaiAuthToken}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(openaiAuthToken)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

              </div>
            </div>
          </div>

          {acpEnabled && openaiEndpoint && openaiAuthToken && (
            <>
              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-6 w-6 p-0">
                      <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {stats.totalProducts}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {t('chatgptCommerce.stats.totalProducts', 'Total Products')}
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <Eye className="h-5 w-5 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {stats.totalViews.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    {t('chatgptCommerce.stats.views', 'Product Views')}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <TrendingUp className="h-5 w-5 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {stats.clickThroughRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    {t('chatgptCommerce.stats.ctr', 'Success Rate')}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <BarChart3 className="h-5 w-5 text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {stats.productsIndexed}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">
                    {t('chatgptCommerce.stats.indexed', 'Indexed')}
                  </div>
                </div>
              </div>

              {stats.lastSync && (
                <p className="text-xs text-muted-foreground text-center">
                  {t('chatgptCommerce.lastSynced', 'Last Sync')}: {stats.lastSync.toLocaleString()}
                </p>
              )}

              {/* Download Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleDownloadFeed}
                  disabled={saving || refreshing}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t('chatgptCommerce.downloadFeed', 'Download Product Feed (jsonl.gz)')}
                </Button>
              </div>

              {/* How it Works */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1.5">
                      {isEl ? 'Πώς λειτουργεί' : 'How it works'}
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-sans">
                      {isEl 
                        ? 'Τα προϊόντα σας αυτόματα διαβάζονται από όλα τα LLMs (Claude, ChatGPT, κτλπ.) μέσω του server του SigmaLabs και του αρχείου llms.txt.' 
                        : 'Your products are automatically read by all LLMs (Claude, ChatGPT, etc.) through the SigmaLabs server and the llms.txt file.'}
                    </p>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </details>
    </Card>
  );
};