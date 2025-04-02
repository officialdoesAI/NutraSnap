import { useState } from 'react';
import { Link } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Share2, ArrowLeft, Download, Phone, Smartphone, Globe, Info, HelpCircle, Plus } from 'lucide-react';

// Import the images
import AppStoreIconPath from '@assets/appstore.png';
import IOSScreenshot1Path from '@assets/IMG_0081.png';
import IOSScreenshot2Path from '@assets/IMG_0086.png';

export default function MobileDistributionPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>(isMobile ? 'ios' : 'distribution');
  
  // Function to share the app URL
  const shareApp = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'NutriLens - AI Food Scanner',
          text: 'Track your calories with AI-powered food scanning!',
          url: window.location.origin,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.origin);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="container max-w-3xl px-4 py-8 mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Mobile Installation</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-primary" />
            <span>NutriLens Mobile App</span>
          </CardTitle>
          <CardDescription>
            Install NutriLens on your mobile device for the best experience
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue={activeTab} className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="ios">iOS Installation</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Install on iOS</CardTitle>
              <CardDescription>
                Add NutriLens to your iPhone or iPad home screen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-slate-50 p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Method 1: Add to Home Screen (Recommended)
                </h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>Open NutriLens in <strong>Safari</strong> browser</li>
                  <li>Tap the <strong>Share</strong> button <Share2 className="h-4 w-4 inline mx-1" /></li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right corner</li>
                </ol>
                <div className="mt-4 border rounded-md p-3 bg-yellow-50 text-yellow-800">
                  <p className="text-sm flex items-start">
                    <HelpCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    This method works best and provides a full-screen app experience without browser controls
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Screenshots</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <img 
                      src={IOSScreenshot1Path} 
                      alt="NutriLens iOS Screenshot" 
                      className="rounded-lg border shadow-sm object-cover h-64 w-full"
                    />
                    <p className="text-xs text-center mt-2 text-gray-500">NutriLens Scan Screen</p>
                  </div>
                  <div>
                    <img 
                      src={IOSScreenshot2Path}
                      alt="NutriLens iOS Screenshot" 
                      className="rounded-lg border shadow-sm object-cover h-64 w-full"
                    />
                    <p className="text-xs text-center mt-2 text-gray-500">Subscription Screen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution Options</CardTitle>
              <CardDescription>
                Different ways to distribute and access NutriLens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="browser">
                  <AccordionTrigger className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Browser Access (Universal)
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Access NutriLens directly through any modern web browser on any device.
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Simply share this URL with users:
                    </p>
                    <div className="flex items-center bg-slate-50 rounded-md p-3">
                      <code className="text-sm text-slate-700 flex-grow truncate">
                        {window.location.origin}
                      </code>
                      <Button variant="outline" size="sm" onClick={shareApp}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="pwa">
                  <AccordionTrigger className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    PWA Installation (Recommended)
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      NutriLens is a Progressive Web App (PWA) that can be installed on most devices.
                    </p>
                    
                    <div className="mb-3 p-3 bg-slate-50 rounded-md">
                      <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Works offline or with poor connection</li>
                        <li>Faster loading times after first visit</li>
                        <li>Home screen icon like native apps</li>
                        <li>Full-screen interface without browser controls</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/profile">
                          <Phone className="h-4 w-4 mr-2" />
                          Install Instructions
                        </Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="appstore">
                  <AccordionTrigger className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    App Store Submission (Coming Soon)
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      We're working on submitting NutriLens to app stores for easier distribution.
                    </p>
                    
                    <div className="flex items-center justify-center mb-4">
                      <img 
                        src={AppStoreIconPath} 
                        alt="App Store" 
                        className="h-16 rounded-xl opacity-50"
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm">
                      <p className="flex items-start">
                        <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        App store versions are currently under development. In the meantime, use the PWA installation method for a native-like experience.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <p className="text-sm text-gray-500 mb-3">
                Need help with distribution? Contact our support team for assistance.
              </p>
              <Button variant="default" onClick={shareApp} className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share NutriLens App
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}