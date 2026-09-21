"use client";

import * as React from "react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Select,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Tooltip,
  ThemeSwitcher,
  LanguageSwitcher,
} from "@/components/ui";

export function UIShowcase() {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [checkboxChecked, setCheckboxChecked] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Header & Theme Control */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Design System & Component Library
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Musnad UI Components
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            A comprehensive suite of accessible, token-driven UI components
            engineered with Tailwind CSS v4, supporting brand crimson accents and
            responsive dark/light modes.
          </p>
        </div>

        {isMounted && (
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher variant="dropdown" size="sm" />
            <ThemeSwitcher variant="dropdown" size="sm" />
          </div>
        )}
      </div>

      {/* Theme & Language Switchers Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Theme & Language Switchers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hydration-safe components for instant theme switching (Light, Dark, Auto) and locale toggling (English, العربية) across multiple UI layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Switcher Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Switcher Variants</CardTitle>
              <CardDescription>
                Icon quick-toggle, segmented 3-way radio pill, and dropdown menu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  1. Compact Icon Button (for Navbar/Header)
                </span>
                <div className="flex items-center gap-3">
                  <ThemeSwitcher variant="icon" size="sm" />
                  <ThemeSwitcher variant="icon" size="md" />
                  <ThemeSwitcher variant="icon" size="lg" />
                  <ThemeSwitcher variant="icon" size="md" showLabel />
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  2. Segmented Radio Pill (Light | System | Dark)
                </span>
                <ThemeSwitcher variant="segmented" showLabel />
              </div>

              <div className="pt-3 border-t border-border">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  3. Dropdown Menu
                </span>
                <ThemeSwitcher variant="dropdown" size="md" />
              </div>
            </CardContent>
          </Card>

          {/* Language Switcher Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Language Switcher Variants</CardTitle>
              <CardDescription>
                Globe quick-toggle, segmented pill, and dropdown with native script names.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  1. Globe Quick-Toggle Button
                </span>
                <div className="flex items-center gap-3">
                  <LanguageSwitcher variant="toggle" size="sm" />
                  <LanguageSwitcher variant="toggle" size="md" />
                  <LanguageSwitcher variant="toggle" size="lg" />
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  2. Segmented Pill (EN | عربي)
                </span>
                <LanguageSwitcher variant="segmented" />
              </div>

              <div className="pt-3 border-t border-border">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  3. Dropdown Menu
                </span>
                <LanguageSwitcher variant="dropdown" size="md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 1. Buttons Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Button Component
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete button styles with all brand variants, multi-size scale, loading state, and icon slots.
          </p>
        </div>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              Primary (Musnad crimson), Secondary, Outline, Ghost, Destructive, Accent, and Link.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Brand</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="accent">Accent Tint</Button>
            <Button variant="link">Link Button</Button>
          </CardContent>
        </Card>

        {/* Multi-Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Sizes Scale</CardTitle>
            <CardDescription>
              From extra small (xs) for dense utility bars up to hero CTA size (xl) and square icon buttons.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small (xs)</Button>
            <Button size="sm">Small (sm)</Button>
            <Button size="md">Medium / Default (md)</Button>
            <Button size="lg">Large (lg)</Button>
            <Button size="xl">Hero Extra Large (xl)</Button>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <span className="text-xs font-medium text-muted-foreground mr-2">Icon buttons:</span>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Search"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              aria-label="Notifications"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Button>
            <Button
              size="icon-lg"
              variant="primary"
              aria-label="Settings"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
          </CardFooter>
        </Card>

        {/* States & Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Button States & Icon Combinations</CardTitle>
            <CardDescription>
              Disabled states, dynamic spinner loading state, and leading/trailing icon adornments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                isLoading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}
              >
                {btnLoading ? "Processing..." : "Click to Test Loading"}
              </Button>

              <Button variant="primary" disabled>
                Disabled Button
              </Button>

              <Button
                variant="secondary"
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                }
              >
                Upload File
              </Button>

              <Button
                variant="outline"
                rightIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                }
              >
                Continue Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. Badges & Chips */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Badge & Tag Components
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Status indicators, categorization tags, dismissible pills, and status dots.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">Brand Crimson</Badge>
              <Badge variant="secondary">Secondary Surface</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="accent">Accent Tint</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              <span className="text-xs font-medium text-muted-foreground mr-2">With Live Indicator Dots:</span>
              <Badge variant="success" dot>Live System</Badge>
              <Badge variant="warning" dot>Maintenance</Badge>
              <Badge variant="destructive" dot>High Severity</Badge>
              <Badge variant="default" dot>Musnad Cloud</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              <span className="text-xs font-medium text-muted-foreground mr-2">Dismissible Tags:</span>
              <Badge variant="secondary" onRemove={() => alert("Tag removed")}>
                Engineering
              </Badge>
              <Badge variant="outline" onRemove={() => alert("Tag removed")}>
                Design Tokens
              </Badge>
              <Badge variant="accent" onRemove={() => alert("Tag removed")}>
                Next.js 16
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Form Controls: Input, Textarea, Select, Checkbox, Switch */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Form Controls & Inputs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Inputs with icons and validation states, textareas with counter, styled selects, checkboxes, and switches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Fields & Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Sabri Alshibani"
                helperText="Enter your legal full name"
                required
              />

              <Input
                label="Search Documentation"
                placeholder="Search components, APIs..."
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />

              <Input
                label="Work Email Address"
                type="email"
                defaultValue="invalid-email-format"
                error="Please enter a valid corporate email address."
              />

              <Input
                label="Disabled Input"
                placeholder="Read-only system value"
                disabled
                defaultValue="system-token-xyz-123"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textarea & Dropdown Select</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select label="Project Category" required>
                <option value="cloud">Cloud Architecture & DevOps</option>
                <option value="engineering">Software Product Engineering</option>
                <option value="ai">AI & Machine Learning Solutions</option>
                <option value="security">Cybersecurity & Compliance</option>
              </Select>

              <Textarea
                label="Project Scope & Notes"
                placeholder="Describe project deliverables, timelines, and milestones..."
                showCount
                maxLength={300}
                defaultValue="We need an end-to-end design system with dark mode compatibility."
                helperText="Keep the summary concise and focused."
              />
            </CardContent>
          </Card>
        </div>

        {/* Checkbox and Switches */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Controls</CardTitle>
            <CardDescription>
              Accessible checkboxes and switches for settings, preferences, and agreements.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Checkboxes</h4>
              <Checkbox
                label="Subscribe to product updates"
                description="Receive monthly digests on Musnad Tech features and releases."
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />

              <Checkbox
                label="Indeterminate State"
                description="Indicates partial child item selections."
                indeterminate
              />

              <Checkbox
                label="Disabled State"
                description="Non-editable system policy."
                disabled
                checked
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Switches (Toggles)</h4>
              <Switch
                label="Push Notifications"
                description="Get real-time push alerts on deployment status."
                checked={switchChecked}
                onChange={setSwitchChecked}
              />

              <div className="flex items-center gap-6 pt-2">
                <Switch size="sm" defaultChecked label="Small (sm)" />
                <Switch size="md" defaultChecked label="Medium (md)" />
                <Switch size="lg" defaultChecked label="Large (lg)" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Cards & Surfaces */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Card Surfaces & Layouts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Standard cards, elevated cards, and interactive hover-lifting cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-1">Standard</Badge>
              <CardTitle>Default Surface</CardTitle>
              <CardDescription>Clean subtle border and standard background.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimized for content sections, settings panes, and informational summaries.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Learn More</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <Badge variant="accent" className="w-fit mb-1">Elevated</Badge>
              <CardTitle>Elevated Surface</CardTitle>
              <CardDescription>Distinct elevation with drop shadow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ideal for highlighting primary features, dashboards, and modal previews.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm">Get Started</Button>
            </CardFooter>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <Badge variant="default" className="w-fit mb-1">Interactive</Badge>
              <CardTitle>Hover Card Lift</CardTitle>
              <CardDescription>Transitions upward on hover with subtle glow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hover or click over this card to preview smooth responsive micro-interactions.
              </p>
            </CardContent>
            <CardFooter>
              <span className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                Explore Project &rarr;
              </span>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 5. Dialog / Modal */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Modal Dialog
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Accessible dialog with focus management, backdrop blur, keyboard escape listener, and portal rendering.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base text-foreground">Interactive Modal Dialog</h3>
              <p className="text-sm text-muted-foreground">
                Click to open an accessible dialog overlay with form controls.
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="primary" leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }>
                  Open Dialog Preview
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure Service Deployment</DialogTitle>
                  <DialogDescription>
                    Provide deployment configuration parameters for the Musnad Edge network.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <Input
                    label="Environment Name"
                    defaultValue="production-us-east"
                    placeholder="e.g. production"
                  />
                  <Select label="Instance Tier">
                    <option>Musnad Enterprise (32 vCPU, 128GB RAM)</option>
                    <option>Standard Edge (8 vCPU, 32GB RAM)</option>
                    <option>Micro Development (2 vCPU, 8GB RAM)</option>
                  </Select>
                  <Checkbox
                    label="Enable zero-downtime rolling update"
                    defaultChecked
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDialogOpen(false);
                      alert("Deployment scheduled!");
                    }}
                  >
                    Confirm & Deploy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>

      {/* 6. Tabs */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Tabs Component
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Segmented tabs supporting Pill and Underline styling variants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pill Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Pill Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" variant="pill">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 rounded-lg bg-muted/30 border border-border/40 mt-3">
                  <h4 className="font-semibold text-sm">System Overview</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    All core systems operational across 12 distributed regions.
                  </p>
                </TabsContent>
                <TabsContent value="analytics" className="p-4 rounded-lg bg-muted/30 border border-border/40 mt-3">
                  <h4 className="font-semibold text-sm">Real-time Analytics</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Traffic increased by 42% over the last 30 days.
                  </p>
                </TabsContent>
                <TabsContent value="settings" className="p-4 rounded-lg bg-muted/30 border border-border/40 mt-3">
                  <h4 className="font-semibold text-sm">Cluster Settings</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage DNS routing and TLS certificates.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Underline Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Underline Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" variant="underline">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Update your public user profile and avatar settings.
                  </p>
                </TabsContent>
                <TabsContent value="security" className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication (2FA) and active sessions.
                  </p>
                </TabsContent>
                <TabsContent value="billing" className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Manage invoices, credit cards, and enterprise contracts.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7. Alerts & Callouts */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Alerts & Notifications
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Informational and contextual banners for state updates and warnings.
          </p>
        </div>

        <div className="space-y-3">
          <Alert variant="info" onClose={() => alert("Info alert dismissed")}>
            <AlertTitle>System Notice</AlertTitle>
            <AlertDescription>
              A new minor version of the Musnad SDK is available for download.
            </AlertDescription>
          </Alert>

          <Alert variant="success" onClose={() => alert("Success alert dismissed")}>
            <AlertTitle>Build Successful</AlertTitle>
            <AlertDescription>
              All 14 UI components compiled cleanly with zero TypeScript errors.
            </AlertDescription>
          </Alert>

          <Alert variant="warning" onClose={() => alert("Warning alert dismissed")}>
            <AlertTitle>Attention Required</AlertTitle>
            <AlertDescription>
              API rate limit threshold reached 80% of allotted monthly quota.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive" onClose={() => alert("Destructive alert dismissed")}>
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>
              Invalid credentials provided. Please verify your token and retry.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* 8. Avatars, Tooltips & Skeletons */}
      <section className="space-y-6 pb-12">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Avatars, Tooltips & Loading Skeletons
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            User avatars with initials and status, hover tooltips, and pulse shimmer placeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatars */}
          <Card>
            <CardHeader>
              <CardTitle>Avatars & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar alt="Sabri Alshibani" size="xs" status="online" />
                <Avatar alt="Sarah Jenkins" size="sm" status="online" />
                <Avatar alt="Musnad Tech" size="md" status="busy" />
                <Avatar alt="Alex Mercer" size="lg" status="away" />
                <Avatar alt="Founder Admin" size="xl" status="online" />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Avatar alt="Rounded Avatar" size="md" shape="rounded" status="online" />
                <span className="text-xs text-muted-foreground">Squircle shape with active status</span>
              </div>
            </CardContent>
          </Card>

          {/* Tooltips */}
          <Card>
            <CardHeader>
              <CardTitle>Tooltips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xs text-muted-foreground">Hover or focus over the elements below:</p>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Tooltip on top" side="top">
                  <Button variant="outline" size="sm">Hover Top</Button>
                </Tooltip>

                <Tooltip content="Tooltip on bottom" side="bottom">
                  <Button variant="outline" size="sm">Hover Bottom</Button>
                </Tooltip>

                <Tooltip content="Tooltip on right" side="right">
                  <Button variant="outline" size="sm">Hover Right</Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Skeletons */}
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10" shape="circle" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
