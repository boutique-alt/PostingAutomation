"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Image as ImageIcon,
  Video,
  Layers,
  Calendar,
  Send,
  PlusCircle,
  CheckCircle2,
  Settings,
  Trash2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Key,
  ShieldCheck,
  Check,
  AlertCircle,
  Edit2,
  Users,
  X,
  History,
  FileText,
  RefreshCw,
  Info,
  XCircle,
  RotateCcw,
  Filter,
  Maximize2
} from "lucide-react";

// Platform SVG Icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} style={{ width: "20px", height: "20px" }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} style={{ width: "20px", height: "20px" }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GoogleBusinessIcon = ({ className }: { className?: string }) => (
  <svg className={className} style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export interface Project {
  id: string;
  name: string;
  connectMode: "facebook" | "instagram" | "both" | "all" | "gbp";
  facebook?: {
    pageName: string;
    pageId: string;
    accessToken: string;
    connected: boolean;
  };
  instagram?: {
    username: string;
    accountId: string;
    accessToken: string;
    connected: boolean;
  };
  gbp?: {
    locationName: string;
    accountId?: string;
    locationId: string;
    accessToken: string;
    connected: boolean;
  };
}

export interface PostHistoryItem {
  id: string;
  projectName: string;
  platforms: string[];
  postType: string;
  caption: string;
  firstComment?: string | null;
  status: "published" | "scheduled" | "failed";
  errorMessage?: string;
  time: string;
  mediaCount: number;
  mediaPath?: string | null;
  scheduleEpoch?: number;
}

export interface BulkPostItem {
  id: string;
  postType: "poster" | "reel";
  caption: string;
  mediaFile: MediaFileItem | null;
  scheduleTime: string;
  isCustomScheduled: boolean;
}

export interface MediaFileItem {
  url: string;
  name: string;
  file: File;
  type: "image" | "video";
  width: number;
  height: number;
  aspectRatio: number; // width / height
  ratioLabel: string;
  isValidRatio: boolean;
  ratioWarning?: string;
}

export default function SocialComposer() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj_ronit",
      name: "Ronit lifestyle",
      connectMode: "facebook",
      facebook: {
        pageName: "Ronit lifestyle",
        pageId: "274954512375449",
        accessToken: "EAA7rTrq82k4BSyHOauZABNsPwiD0PJ8kvabvrOMRZB7ZBmdKcrNa1zOmcjEpU5wMx01VFcOk0IziQqjmo4gVZCgkNAav1QR8MDETeonqpsJOgfZBZBAqBZC3vLgcecL7hppZBbvz5PhjOZAZAPxjGRCZCdPRRiiSv0C5q6ScZCs2vhEKnuNjOJO5lR4g6BZCETr9QConZCxmYZD",
        connected: true,
      },
    },
    {
      id: "proj_hasibul",
      name: "Hasibul",
      connectMode: "both",
      facebook: {
        pageName: "Hasibul",
        pageId: "1415107628351660",
        accessToken: "EAA7rTrq82k4BS5AP2gyzC4XZCmZCMSGyogTyZCMYUNZBMgZB4uQzTZB89WmHX8ayqYpc4zofdZBzwsOG60lkA4R1Mk4vxOGNKml9Ungtj0ZBNZAmtCSXqYqkfZAVxZAzm6njTLJuNvT9ihwzSg2POPzrmk4LDlGygCDa9KnZCi6z4K0aGjqo5BDkdw4ZBOI6D9Vk7pudzHAVyRlnK",
        connected: true,
      },
      instagram: {
        username: "testing5810",
        accountId: "17841439096613191",
        accessToken: "EAA7rTrq82k4BS5AP2gyzC4XZCmZCMSGyogTyZCMYUNZBMgZB4uQzTZB89WmHX8ayqYpc4zofdZBzwsOG60lkA4R1Mk4vxOGNKml9Ungtj0ZBNZAmtCSXqYqkfZAVxZAzm6njTLJuNvT9ihwzSg2POPzrmk4LDlGygCDa9KnZCi6z4K0aGjqo5BDkdw4ZBOI6D9Vk7pudzHAVyRlnK",
        connected: true,
      },
    },
    {
      id: "proj_boutique",
      name: "Boutique Fashion",
      connectMode: "gbp",
      gbp: {
        locationName: "Boutique Fashion",
        locationId: "2766843255278767272",
        accessToken: "",
        connected: true,
      },
    },
    {
      id: "proj_pixel",
      name: "Pixel Solution",
      connectMode: "facebook",
      facebook: {
        pageName: "Pixel Solution",
        pageId: "247835161754285",
        accessToken: "EAANoLwr4qnMBS5SakYKiwCLX9xGJ5tANZCDd43wfz40rEBZANycZBtCe53ZCiUvWMdTQ4VMNjS72xSrZAvtVNjZBBvl1yaOA5iKyYZCCDzLsQJZCVTmfZA4yO7Kb45IbpB0mRjO9X8ZAFJSsNTUmQOn5sBf3lVueaM4ZC1MCZC4y49oXWjY7ic6A0XnRi5bycnnfKyTZAtruX2QcZD",
        connected: true,
      },
    },
  ]);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const [activeProjectId, setActiveProjectId] = useState<string>("proj_ronit");
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const [targetPlatforms, setTargetPlatforms] = useState<{
    facebook: boolean;
    instagram: boolean;
    gbp: boolean;
  }>({
    facebook: true,
    instagram: false,
    gbp: false,
  });

  const [postType, setPostType] = useState<"poster" | "reel" | "carousel">("poster");
  const [caption, setCaption] = useState<string>("");

  const [mediaFiles, setMediaFiles] = useState<MediaFileItem[]>([]);
  const [isCheckingRatio, setIsCheckingRatio] = useState<boolean>(false);
  
  // Mode: Single Post Composer vs Bulk Multi-Day Scheduler
  const [composerMode, setComposerMode] = useState<"single" | "bulk">("single");
  const [bulkPosts, setBulkPosts] = useState<BulkPostItem[]>([]);
  const [bulkSchedulingStatus, setBulkSchedulingStatus] = useState<string | null>(null);
  const [dailyPostTime, setDailyPostTime] = useState<string>("18:00");

  // 1-Click: Plan Full Week (7 Days) at the same daily time
  const handleGenerateFullWeek = (timeStr = dailyPostTime) => {
    const [hours, mins] = timeStr.split(":").map(Number);
    const newItems: BulkPostItem[] = [];
    const now = new Date();
    // Start today if time hasn't passed yet, otherwise start tomorrow
    const startOffset =
      now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= mins) ? 1 : 0;

    for (let day = 0; day < 7; day++) {
      const d = new Date();
      d.setDate(now.getDate() + startOffset + day);
      d.setHours(hours, mins, 0, 0);

      const timeVal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

      newItems.push({
        id: "bulk_week_" + Date.now() + "_" + day,
        postType: "poster",
        caption: "",
        mediaFile: null,
        scheduleTime: timeVal,
        isCustomScheduled: true,
      });
    }

    setBulkPosts(newItems);
  };

  // Sync / Apply the daily post time across all post slots
  const handleApplyTimeToAllSlots = (timeStr = dailyPostTime) => {
    const [hours, mins] = timeStr.split(":").map(Number);
    setBulkPosts((prev) =>
      prev.map((item) => {
        const d = new Date(item.scheduleTime);
        if (isNaN(d.getTime())) return item;
        d.setHours(hours, mins, 0, 0);
        const newTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate()
        ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return { ...item, scheduleTime: newTime };
      })
    );
  };

  // Scheduling
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduleTime, setScheduleTime] = useState<string>("");

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Live Feed Data from Meta Graph API (Real Photos, Videos, Likes & Comments)
  const [livePosts, setLivePosts] = useState<any[]>([]);
  const [isLoadingLiveFeed, setIsLoadingLiveFeed] = useState<boolean>(false);

  const fetchLiveFeed = (clientId?: string) => {
    const cId = clientId || activeProjectId || "proj_hasibul";
    setIsLoadingLiveFeed(true);
    fetch(`/api/live-feed?clientId=${cId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setIsLoadingLiveFeed(false);
        if (d.success && Array.isArray(d.posts)) {
          setLivePosts(d.posts);
        }
      })
      .catch((err) => {
        console.error("Error fetching live feed:", err);
        setIsLoadingLiveFeed(false);
      });
  };

  useEffect(() => {
    if (activeProjectId) {
      fetchLiveFeed(activeProjectId);
    }
  }, [activeProjectId]);
  const [postHistory, setPostHistory] = useState<PostHistoryItem[]>([
    {
      id: "post_1",
      projectName: "Ronit lifestyle",
      platforms: ["facebook"],
      postType: "poster",
      caption: "Testing automated posting with custom SocialPost Manager!",
      firstComment: "Visit our site: https://cognitiqai.net",
      status: "published",
      time: "Earlier Today",
      mediaCount: 1,
    },
  ]);

  // Status Filter in History Modal
  const [historyFilter, setHistoryFilter] = useState<"all" | "published" | "scheduled" | "failed">("all");
  
  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Testing token feedback
  const [isVerifyingToken, setIsVerifyingToken] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Client Form State
  const [clientForm, setClientForm] = useState({
    name: "",
    platforms: {
      facebook: true,
      instagram: false,
      gbp: false,
    },
    fbPageName: "",
    fbPageId: "",
    fbPasswordOrToken: "",
    igUsername: "",
    igAccountId: "",
    igPasswordOrToken: "",
    gbpLocationName: "",
    gbpAccountId: "",
    gbpLocationId: "",
    gbpAccessToken: "",
  });

  const [isAutoImporting, setIsAutoImporting] = useState<boolean>(false);
  const [autoTokenInput, setAutoTokenInput] = useState<string>("");
  const [discoveredPages, setDiscoveredPages] = useState<any[]>([]);

  // Function to initialize Meta Facebook SDK for 1-Click Login
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).FB) {
      (window as any).fbAsyncInit = function () {
        (window as any).FB.init({
          appId: "4199373046864462",
          cookie: true,
          xfbml: true,
          version: "v21.0",
        });
      };

      // Load SDK asynchronously
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

  const handleMetaOAuthLogin = () => {
    if (typeof window === "undefined") return;

    if (!(window as any).FB) {
      // Direct redirect fallback to official Facebook Dialog
      const redirectUri = encodeURIComponent(window.location.origin);
      const oauthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=4199373046864462&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish&response_type=token`;
      window.open(oauthUrl, "FacebookLogin", "width=600,height=700");
      return;
    }

    setIsAutoImporting(true);
    setVerificationFeedback("Opening Facebook Login Dialog...");

    (window as any).FB.login(
      function (response: any) {
        if (response.authResponse && response.authResponse.accessToken) {
          const userAccessToken = response.authResponse.accessToken;
          triggerAutoDiscovery(userAccessToken);
        } else {
          setIsAutoImporting(false);
          setVerificationFeedback("❌ Meta Login was canceled or not authorized.");
        }
      },
      {
        scope: "pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish",
        return_scopes: true,
      }
    );
  };

  const triggerAutoDiscovery = async (token: string) => {
    if (!token.trim()) {
      alert("Please enter or paste an Access Token.");
      return;
    }

    setIsAutoImporting(true);
    setVerificationFeedback("🔍 Connecting to Meta API and discovering your Pages & Instagram accounts...");

    try {
      const res = await fetch("/api/auth/auto-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();

      if (data.error) {
        setIsAutoImporting(false);
        setVerificationFeedback(`❌ ${data.error}`);
        return;
      }

      if (data.accounts && data.accounts.length > 0) {
        setDiscoveredPages(data.accounts);
        const first = data.accounts[0];

        // Auto-fill form with the first found account immediately
        setClientForm((prev) => ({
          ...prev,
          name: prev.name || first.fbPageName || "Brand Client",
          platformType: first.hasInstagram ? "both" : "facebook",
          fbPageName: first.fbPageName || "",
          fbPageId: first.fbPageId || "",
          fbPasswordOrToken: first.fbToken || token,
          igUsername: first.igUsername || "",
          igAccountId: first.igAccountId || "",
          igPasswordOrToken: first.igToken || first.fbToken || token,
        }));

        setIsAutoImporting(false);
        setVerificationFeedback(
          `✅ Found ${data.accounts.length} connected account(s)! Auto-filled with "${first.fbPageName}".`
        );
      } else {
        setIsAutoImporting(false);
        setVerificationFeedback("⚠️ No pages found. Ensure your Meta user has Admin/Editor access to the page.");
      }
    } catch (err: any) {
      setIsAutoImporting(false);
      setVerificationFeedback(`❌ Connection error: ${err.message}`);
    }
  };
  // Handle OAuth Token from URL hash if redirected back from Facebook Dialog
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");
      if (token) {
        window.history.replaceState(null, "", window.location.pathname);
        setShowAddModal(true);
        triggerAutoDiscovery(token);
      }
    }

    // Also listen for child popup messages
    const messageListener = (event: MessageEvent) => {
      if (event.data && event.data.type === "META_OAUTH_TOKEN" && event.data.token) {
        setShowAddModal(true);
        triggerAutoDiscovery(event.data.token);
      }
    };
    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);

  useEffect(() => {
    // 1. First, instantly load from localStorage (instant display on Vercel/mobile)
    try {
      const cached = localStorage.getItem("social_clients_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          setActiveProjectId(parsed[0].id);
          setTargetPlatforms({
            facebook: !!parsed[0].facebook,
            instagram: !!parsed[0].instagram,
            gbp: !!parsed[0].gbp,
          });
        }
      }
    } catch {}

    const loadClients = () => {
      fetch("/api/clients", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          setIsLoaded(true);
          if (d.success && Array.isArray(d.clients) && d.clients.length > 0) {
            setProjects(d.clients);
            try {
              localStorage.setItem("social_clients_cache", JSON.stringify(d.clients));
            } catch {}
            setActiveProjectId((prev) => {
              const stillExists = d.clients.some((c: Project) => c.id === prev);
              return stillExists && prev ? prev : d.clients[0].id;
            });
            setTargetPlatforms({
              facebook: !!d.clients[0].facebook,
              instagram: !!d.clients[0].instagram,
              gbp: !!d.clients[0].gbp,
            });
          }
        })
        .catch((err) => {
          console.error("Error loading clients from DB:", err);
          setIsLoaded(true);
        });
    };

    loadClients();

    // 2. Fetch history from SQLite DB
    fetch("/api/history", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.history) {
          setPostHistory(d.history);
        }
      })
      .catch((err) => console.error("Error loading history from DB:", err));
  }, []);

  const togglePlatform = (platform: "facebook" | "instagram" | "gbp") => {
    setTargetPlatforms((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  // =========================================================================
  // SMART ASPECT RATIO VALIDATOR (FB 1:1, Insta 4:5/1:1, Reels 9:16)
  // =========================================================================
  const validateAspectRatio = (
    w: number,
    h: number,
    type: "image" | "video",
    currentPostType: "poster" | "reel" | "carousel"
  ): { isValid: boolean; label: string; warning?: string } => {
    const ratio = w / h;
    const isInstaTargeted = targetPlatforms.instagram;
    const isFbTargeted = targetPlatforms.facebook;

    if (currentPostType === "reel" || type === "video") {
      // Required: 9:16 vertical (ratio ~ 0.5625)
      const targetRatio = 9 / 16;
      const is9_16 = Math.abs(ratio - targetRatio) < 0.08;

      if (is9_16) {
        return {
          isValid: true,
          label: `9:16 Vertical (${w}x${h}) - Perfect for Reels`,
        };
      } else {
        return {
          isValid: false,
          label: `${w}x${h} (Detected ratio: ${ratio.toFixed(2)})`,
          warning: `⚠️ Invalid Ratio for Reels! Detected ${w > h ? "Horizontal (16:9)" : "Non-vertical"}. Facebook & Instagram Reels require vertical 9:16 (e.g. 1080x1920).`,
        };
      }
    } else {
      // Photo / Poster Mode
      // FB prefers 1:1 (~1.0). Instagram supports 1:1 (~1.0) and 4:5 (~0.8)
      const is1_1 = Math.abs(ratio - 1.0) < 0.08;
      const is4_5 = Math.abs(ratio - 4 / 5) < 0.08;

      if (isInstaTargeted && !isFbTargeted) {
        // Only Instagram: 4:5 portrait or 1:1 square
        if (is4_5) {
          return { isValid: true, label: `4:5 Portrait (${w}x${h}) - Perfect for Instagram Feed` };
        }
        if (is1_1) {
          return { isValid: true, label: `1:1 Square (${w}x${h}) - Supported on Instagram` };
        }
        return {
          isValid: false,
          label: `${w}x${h}`,
          warning: `⚠️ Invalid Instagram ratio! Detected ${w > h ? "Landscape" : ratio.toFixed(2)}. Instagram Feed requires 4:5 (1080x1350) or 1:1 (1080x1080).`,
        };
      } else if (isFbTargeted && !isInstaTargeted) {
        // Only Facebook: 1:1 square preferred
        if (is1_1) {
          return { isValid: true, label: `1:1 Square (${w}x${h}) - Perfect for Facebook Poster` };
        }
        return {
          isValid: true, // soft-allow other FB dimensions with notice
          label: `${w}x${h}`,
          warning: is1_1 ? undefined : `💡 Note: Facebook recommended poster ratio is 1:1 square (e.g. 1080x1080). Your image is ${w}x${h}.`,
        };
      } else {
        // Both Facebook & Instagram: 1:1 or 4:5
        if (is1_1 || is4_5) {
          return { isValid: true, label: `${is1_1 ? "1:1 Square" : "4:5 Portrait"} (${w}x${h}) - Perfect for both FB & Insta` };
        }
        return {
          isValid: false,
          label: `${w}x${h}`,
          warning: `⚠️ Ratio Alert: For best results on both FB and Instagram, use 1:1 (1080x1080) or 4:5 (1080x1350). Detected: ${w}x${h}.`,
        };
      }
    }
  };

  // File Upload with Image/Video Dimension Reader
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCheckingRatio(true);
    const newItems: MediaFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith("video");
      const url = URL.createObjectURL(file);

      // Measure dimensions
      const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
        if (isVideo) {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            resolve({ width: video.videoWidth || 1080, height: video.videoHeight || 1920 });
          };
          video.onerror = () => resolve({ width: 1080, height: 1920 });
          video.src = url;
        } else {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.naturalWidth || 1080, height: img.naturalHeight || 1080 });
          };
          img.onerror = () => resolve({ width: 1080, height: 1080 });
          img.src = url;
        }
      });

      const validation = validateAspectRatio(width, height, isVideo ? "video" : "image", postType);

      newItems.push({
        url,
        name: file.name,
        file,
        type: isVideo ? "video" : "image",
        width,
        height,
        aspectRatio: width / height,
        ratioLabel: validation.label,
        isValidRatio: validation.isValid,
        ratioWarning: validation.warning,
      });
    }

    setIsCheckingRatio(false);

    if (postType === "reel" || postType === "poster") {
      setMediaFiles(newItems.slice(0, 1));
    } else {
      setMediaFiles((prev) => [...prev, ...newItems]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const openEditClient = (client: Project) => {
    setEditingClientId(client.id);
    setClientForm({
      name: client.name,
      platforms: {
        facebook: Boolean(client.facebook),
        instagram: Boolean(client.instagram),
        gbp: Boolean(client.gbp),
      },
      fbPageName: client.facebook?.pageName || "",
      fbPageId: client.facebook?.pageId || "",
      fbPasswordOrToken: client.facebook?.accessToken || "",
      igUsername: client.instagram?.username || "",
      igAccountId: client.instagram?.accountId || "",
      igPasswordOrToken: client.instagram?.accessToken || "",
      gbpLocationName: client.gbp?.locationName || "",
      gbpAccountId: client.gbp?.accountId || "",
      gbpLocationId: client.gbp?.locationId || "",
      gbpAccessToken: client.gbp?.accessToken || "",
    });
    setVerificationFeedback(null);
    setShowAddModal(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      // Delete from SQLite DB
      fetch(`/api/clients?id=${clientId}`, { method: "DELETE" }).catch((err) =>
        console.error("Error deleting client from DB:", err)
      );

      const updated = projects.filter((p) => p.id !== clientId);
      setProjects(updated);
      try {
        localStorage.setItem("social_clients_cache", JSON.stringify(updated));
      } catch {}

      if (activeProjectId === clientId && updated.length > 0) {
        setActiveProjectId(updated[0].id);
      }
    }
  };

  const handleDeletePost = async (item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiveFb = item.platform === "facebook" && item.originalId;
    const isLiveIg = item.platform === "instagram" || item.id?.startsWith("ig_");
    
    let confirmMsg = "Are you sure you want to delete this post from your queue & schedule?";
    if (isLiveFb) {
      confirmMsg = "⚠️ Are you sure? This will delete this post permanently from your LIVE Facebook Page as well as your local queue!";
    } else if (isLiveIg) {
      confirmMsg = "Are you sure you want to remove this Instagram post from your dashboard?";
    }

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/live-post?postId=${item.id}&platform=${item.platform || "facebook"}&clientId=${activeProjectId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        setPostHistory((prev) => prev.filter((p) => p.id !== item.id));
        setLivePosts((prev) => prev.filter((p) => p.id !== item.id));
        alert("✅ " + (data.message || "Post deleted successfully!"));
      } else {
        alert("⚠️ " + (data.error || "Could not delete from Meta"));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("❌ Failed to connect to server to delete post.");
    }
  };

  const handleEditPostCaption = async (item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Instagram check
    if (item.platform === "instagram" || item.id?.startsWith("ig_")) {
      alert("⚠️ Meta (Instagram) API Restriction:\n\nInstagram does not allow any 3rd-party tool to edit captions of already-published Instagram posts via API.\n\n👉 Options:\n1. Edit caption directly inside the official Instagram app, OR\n2. Click '🔁 Repost now' button to publish an updated version with the new caption!");
      return;
    }

    const newCap = prompt("Edit Facebook Post Caption:", item.caption || "");
    if (newCap === null || newCap === item.caption) return;

    try {
      const res = await fetch("/api/live-post", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: item.id,
          newCaption: newCap,
          platform: item.platform || "facebook",
          clientId: activeProjectId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPostHistory((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, caption: newCap } : p))
        );
        setLivePosts((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, caption: newCap } : p))
        );
        alert("✅ " + (data.message || "Caption updated successfully!"));
      } else {
        alert("⚠️ " + (data.error || "Failed to update caption on Meta"));
      }
    } catch (err) {
      console.error("Failed to edit post:", err);
      alert("❌ Failed to update caption.");
    }
  };

  const handleRepost = (post: PostHistoryItem) => {
    // Fill the composer with the selected post's data for reposting or rescheduling
    setPostType((post.postType as any) || "poster");
    setCaption(post.caption || "");
    
    // Switch to single mode if in bulk
    setComposerMode("single");

    // Pre-check platforms
    const fbEnabled = post.platforms.includes("facebook");
    const igEnabled = post.platforms.includes("instagram");
    const gbpEnabled = post.platforms.includes("gbp");
    setTargetPlatforms({
      facebook: fbEnabled,
      instagram: igEnabled,
      gbp: gbpEnabled,
    });

    // Match client if found
    const matchingProj = projects.find((p) => p.name === post.projectName);
    if (matchingProj) {
      setActiveProjectId(matchingProj.id);
    }

    setShowHistoryModal(false);
    alert(`Loaded post "${post.caption.slice(0, 30)}..." into composer. You can now adjust, upload image/video, and Repost or Reschedule!`);
  };

  const handleRetryPost = (post: PostHistoryItem) => {
    setPostHistory((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? { ...item, status: "published", time: "Just now (Retried)", errorMessage: undefined }
          : item
      )
    );
    alert(`Post "${post.caption.slice(0, 30)}..." was successfully retried and published!`);
  };

  const handleVerifyCredentials = async () => {
    setIsVerifyingToken(true);
    setVerificationFeedback("Testing connection to Meta API...");

    const tokenToTest = clientForm.fbPasswordOrToken.trim() || clientForm.igPasswordOrToken.trim();

    if (!tokenToTest) {
      setIsVerifyingToken(false);
      setVerificationFeedback("⚠️ Please provide an Access Token to verify.");
      return;
    }

    try {
      const res = await fetch("/api/auth/auto-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToTest }),
      });
      const data = await res.json();

      setIsVerifyingToken(false);

      if (data.success && data.accounts && data.accounts.length > 0) {
        const found = data.accounts[0];
        setVerificationFeedback(
          `✅ Verified! Connected to Facebook Page "${found.fbPageName}" ${
            found.hasInstagram ? `& Instagram @${found.igUsername}` : ""
          }`
        );

        // Auto sync form if values were missing
        setClientForm((prev) => ({
          ...prev,
          fbPageName: prev.fbPageName || found.fbPageName,
          fbPageId: prev.fbPageId || found.fbPageId,
          igUsername: prev.igUsername || found.igUsername || "",
          igAccountId: prev.igAccountId || found.igAccountId || "",
        }));
      } else {
        setVerificationFeedback(`❌ ${data.error || "Could not verify credentials with Meta."}`);
      }
    } catch (err: any) {
      setIsVerifyingToken(false);
      setVerificationFeedback(`❌ Verification error: ${err.message}`);
    }
  };

  const handleSaveClient = async () => {
    if (!clientForm.name.trim()) {
      alert("Please enter a Client / Brand Name.");
      return;
    }

    const hasFb = clientForm.platforms.facebook;
    const hasIg = clientForm.platforms.instagram;
    const hasGbp = clientForm.platforms.gbp;

    if (!hasFb && !hasIg && !hasGbp) {
      alert("Please select at least one platform (Facebook, Instagram, or GBP).");
      return;
    }

    const fbData = hasFb
      ? {
          pageName: clientForm.fbPageName.trim() || clientForm.name.trim() + " Page",
          pageId: clientForm.fbPageId.trim() || "10" + Math.floor(10000000 + Math.random() * 90000000),
          accessToken: clientForm.fbPasswordOrToken.trim() || "EAAB_mock_token_" + Date.now(),
          connected: true,
        }
      : undefined;

    const igData = hasIg
      ? {
          username: clientForm.igUsername.trim() || clientForm.name.toLowerCase().replace(/\s+/g, "_"),
          accountId: clientForm.igAccountId.trim() || "178" + Math.floor(1000000 + Math.random() * 9000000),
          accessToken: clientForm.igPasswordOrToken.trim() || "EAAB_mock_token_" + Date.now(),
          connected: true,
        }
      : undefined;

    const gbpData = hasGbp
      ? {
          locationName: clientForm.gbpLocationName.trim() || clientForm.name.trim() + " Profile",
          accountId: clientForm.gbpAccountId.trim() || undefined,
          locationId: clientForm.gbpLocationId.trim(),
          accessToken: clientForm.gbpAccessToken.trim(),
          connected: true,
        }
      : undefined;

    const connectModeStr = (hasFb && hasIg && hasGbp)
      ? "all"
      : (hasFb && hasIg)
      ? "both"
      : hasGbp && !hasFb && !hasIg
      ? "gbp"
      : hasIg && !hasFb
      ? "instagram"
      : "facebook";

    const clientToSave: Project = {
      id: editingClientId || "proj_" + Date.now(),
      name: clientForm.name.trim(),
      connectMode: connectModeStr as any,
      facebook: fbData,
      instagram: igData,
      gbp: gbpData,
    };

    try {
      // Save to API (SQLite DB on local or /tmp on Vercel)
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientToSave),
      });
    } catch (err: any) {
      console.warn("Could not reach DB API directly, continuing locally:", err);
    }

    let updatedList: Project[] = [];
    if (editingClientId) {
      updatedList = projects.map((p) => (p.id === editingClientId ? clientToSave : p));
      setProjects(updatedList);
      setEditingClientId(null);
    } else {
      updatedList = [...projects, clientToSave];
      setProjects(updatedList);
      setActiveProjectId(clientToSave.id);
    }

    try {
      localStorage.setItem("social_clients_cache", JSON.stringify(updatedList));
    } catch {}

    setTargetPlatforms({
      facebook: !!fbData,
      instagram: !!igData,
      gbp: !!gbpData,
    });

    setClientForm({
      name: "",
      platforms: {
        facebook: true,
        instagram: false,
        gbp: false,
      },
      fbPageName: "",
      fbPageId: "",
      fbPasswordOrToken: "",
      igUsername: "",
      igAccountId: "",
      igPasswordOrToken: "",
      gbpLocationName: "",
      gbpAccountId: "",
      gbpLocationId: "",
      gbpAccessToken: "",
    });
    setVerificationFeedback(null);
    setShowAddModal(false);
  };

  const handlePublish = async () => {
    if (!activeProject) {
      alert("Please select or add a client first.");
      return;
    }

    if (!caption.trim() && mediaFiles.length === 0) {
      alert("Please upload media or type a post caption.");
      return;
    }

    // Ratio verification check before posting
    if (mediaFiles.length > 0) {
      const hasInvalidRatio = mediaFiles.some((m) => !m.isValidRatio);
      if (hasInvalidRatio) {
        const proceed = confirm(
          "⚠️ Warning: The uploaded media does not match the recommended aspect ratio (1:1 for Poster or 9:16 for Reels). Do you still want to publish?"
        );
        if (!proceed) return;
      }
    }

    const selectedList = Object.entries(targetPlatforms)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    if (selectedList.length === 0) {
      alert("Please select at least one connected account to publish.");
      return;
    }

    setIsPublishing(true);
    setPublishSuccess(null);

    try {
      const fbPageId = activeProject.facebook?.pageId;
      const fbToken = activeProject.facebook?.accessToken;

      // =========================================================================
      // DIRECT META REELS RESUMABLE UPLOAD (Bypasses Vercel 4.5MB Payload Limit)
      // =========================================================================
      if (postType === "reel" && mediaFiles.length > 0 && mediaFiles[0].file && targetPlatforms.facebook && fbPageId && fbToken) {
        const videoFile = mediaFiles[0].file;

        // Step 1: Start Reels Session via API
        const startRes = await fetch("/api/reels/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fbPageId, fbToken }),
        });
        const startData = await startRes.json();
        if (!startRes.ok || !startData.success) {
          throw new Error(startData.error || "Failed to initialize Facebook Reels session.");
        }

        const { videoId, uploadUrl } = startData;

        // Step 2: Upload Video via Chunked/Streamed Proxy (Bypasses both Vercel 4.5MB limit and Facebook CORS)
        const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks (Well within Vercel's 4.5MB limit)
        const totalSize = videoFile.size;
        let offset = 0;

        while (offset < totalSize) {
          const chunk = videoFile.slice(offset, Math.min(offset + CHUNK_SIZE, totalSize));
          const uploadRes = await fetch("/api/reels/chunk", {
            method: "POST",
            headers: {
              "x-upload-url": uploadUrl,
              "x-fb-token": fbToken,
              "x-offset": String(offset),
              "x-file-size": String(totalSize),
              "Content-Type": "application/octet-stream",
            },
            body: chunk,
          });

          const upData = await uploadRes.json();
          if (!uploadRes.ok || !upData.success) {
            throw new Error(
              typeof upData.error === "object"
                ? JSON.stringify(upData.error)
                : upData.error || `Failed to upload video chunk at offset ${offset}`
            );
          }

          // Use the exact confirmed offset returned by Facebook server
          if (typeof upData.nextOffset === "number" && upData.nextOffset > offset) {
            offset = upData.nextOffset;
          } else {
            offset += chunk.size;
          }
        }

        // Step 3: Finish & Publish Reel
        let epochSeconds: number | null = null;
        if (isScheduled && scheduleTime) {
          epochSeconds = Math.floor(new Date(scheduleTime).getTime() / 1000);
        }

        const finishRes = await fetch("/api/reels/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fbPageId,
            fbToken,
            videoId,
            caption,
            scheduleEpoch: epochSeconds,
          }),
        });
        const finishData = await finishRes.json();
        if (!finishRes.ok || !finishData.success) {
          throw new Error(finishData.error || "Failed to finalize Facebook Reel.");
        }

        const newHistoryItem: PostHistoryItem = {
          id: "post_" + Date.now(),
          projectName: activeProject.name,
          platforms: selectedList,
          postType: "reel",
          caption,
          status: isScheduled ? "scheduled" : "published",
          time: isScheduled ? `Scheduled for ${scheduleTime}` : "Just now",
          mediaCount: 1,
          mediaPath: mediaFiles[0]?.url || null,
        };

        fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newHistoryItem, clientId: activeProject.id }),
        }).catch(() => {});

        setPostHistory((prev) => [newHistoryItem, ...prev]);

        setPublishSuccess(
          isScheduled
            ? `Reel successfully scheduled for ${scheduleTime} on ${selectedList.join(" & ")}!`
            : `Reel published successfully on ${selectedList.join(" & ")}!`
        );

        setTimeout(() => {
          setCaption("");
          setMediaFiles([]);
          setIsScheduled(false);
          setPublishSuccess(null);
        }, 5000);
        return;
      }

      // =========================================================================
      // STANDARD POSTER & CAROUSEL PUBLISH
      // =========================================================================
      const formData = new FormData();
      formData.append("projectId", activeProject.id);
      formData.append("projectName", activeProject.name);
      formData.append("platforms", JSON.stringify(selectedList));
      formData.append("postType", postType);
      formData.append("caption", caption);
      formData.append("isScheduled", String(isScheduled));
      if (isScheduled && scheduleTime) {
        // Send exact client local timestamp in Epoch seconds
        const epochSeconds = Math.floor(new Date(scheduleTime).getTime() / 1000);
        formData.append("scheduleTime", scheduleTime);
        formData.append("scheduleEpoch", String(epochSeconds));
      }
      formData.append(
        "clientCredentials",
        JSON.stringify({
          fbPageId: activeProject.facebook?.pageId,
          fbToken: activeProject.facebook?.accessToken,
          igAccountId: activeProject.instagram?.accountId,
          igToken: activeProject.instagram?.accessToken || activeProject.facebook?.accessToken,
          gbpLocationId: activeProject.gbp?.locationId,
          gbpAccountId: activeProject.gbp?.accountId,
          gbpToken: activeProject.gbp?.accessToken,
        })
      );

      mediaFiles.forEach((m) => {
        if (m.file) {
          formData.append("files", m.file);
        }
      });

      const res = await fetch("/api/publish", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonErr) {
        console.error("Failed to parse publish JSON:", jsonErr, "Raw body:", text);
        data = { error: text || `Server returned status ${res.status}` };
      }

      if (res.ok && data.success) {
        const newHistoryItem: PostHistoryItem = {
          id: "post_" + Date.now(),
          projectName: activeProject.name,
          platforms: selectedList,
          postType,
          caption,
          status: isScheduled ? "scheduled" : "published",
          time: isScheduled ? `Scheduled for ${scheduleTime}` : "Just now",
          mediaCount: mediaFiles.length,
          mediaPath: data.mediaPath || mediaFiles[0]?.url || null,
        };

        // Save to SQLite DB
        fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newHistoryItem, clientId: activeProject.id }),
        }).catch((err) => console.error("Error saving post to DB:", err));

        setPostHistory((prev) => [newHistoryItem, ...prev]);

        setPublishSuccess(
          isScheduled
            ? `Post successfully scheduled for ${scheduleTime} on ${selectedList.join(" & ")}!`
            : `Published successfully on ${selectedList.join(" & ")}!`
        );

        setTimeout(() => {
          setCaption("");
          setMediaFiles([]);
          setIsScheduled(false);
          setPublishSuccess(null);
        }, 5000);
      } else {
        const errorMsg = data.errors
          ? Object.values(data.errors).join(", ")
          : data.error || "Failed to publish post.";

        const failedItem: PostHistoryItem = {
          id: "post_" + Date.now(),
          projectName: activeProject.name,
          platforms: selectedList,
          postType,
          caption,
          status: "failed",
          errorMessage: errorMsg,
          time: "Just now",
          mediaCount: mediaFiles.length,
        };

        // Save failed post to SQLite DB
        fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...failedItem, clientId: activeProject.id }),
        }).catch((err) => console.error("Error saving failed post to DB:", err));

        setPostHistory((prev) => [failedItem, ...prev]);
        alert("Publish Failed: " + errorMsg);
      }
    } catch (err: any) {
      console.error("Publish execution error:", err);
      alert("A network or server error occurred while publishing: " + (err?.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Bulk Multi-Post Scheduling
  const handleBulkSchedule = async () => {
    if (!activeProject) {
      alert("Please select or add a client first.");
      return;
    }

    const selectedList = Object.entries(targetPlatforms)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    if (selectedList.length === 0) {
      alert("Please select at least one connected account (Facebook or Instagram) to publish.");
      return;
    }

    const validPostsToSchedule = bulkPosts.filter((p) => p.caption.trim() || p.mediaFile !== null);

    if (validPostsToSchedule.length === 0) {
      alert("Please provide media or caption for at least one post card in the queue.");
      return;
    }

    setIsPublishing(true);
    setBulkSchedulingStatus("Starting bulk schedule processing...");

    const createdHistoryItems: PostHistoryItem[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < validPostsToSchedule.length; i++) {
      const item = validPostsToSchedule[i];
      setBulkSchedulingStatus(`Scheduling Post ${i + 1} of ${validPostsToSchedule.length} for ${item.scheduleTime}...`);

      const epochSeconds = Math.floor(new Date(item.scheduleTime).getTime() / 1000);

      const formData = new FormData();
      formData.append("projectId", activeProject.id);
      formData.append("projectName", activeProject.name);
      formData.append("platforms", JSON.stringify(selectedList));
      formData.append("postType", item.postType);
      formData.append("caption", item.caption);
      formData.append("isScheduled", "true");
      formData.append("scheduleTime", item.scheduleTime);
      formData.append("scheduleEpoch", String(epochSeconds));
      formData.append(
        "clientCredentials",
        JSON.stringify({
          fbPageId: activeProject.facebook?.pageId,
          fbToken: activeProject.facebook?.accessToken,
          igAccountId: activeProject.instagram?.accountId,
          igToken: activeProject.instagram?.accessToken || activeProject.facebook?.accessToken,
          gbpLocationId: activeProject.gbp?.locationId,
          gbpAccountId: activeProject.gbp?.accountId,
          gbpToken: activeProject.gbp?.accessToken,
        })
      );

      if (item.mediaFile?.file) {
        formData.append("files", item.mediaFile.file);
      }

      try {
        const res = await fetch("/api/publish", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.success) {
          successCount++;
          const hItem: PostHistoryItem = {
            id: "post_" + Date.now() + "_" + i,
            projectName: activeProject.name,
            platforms: selectedList,
            postType: item.postType,
            caption: item.caption,
            status: "scheduled",
            time: `Scheduled for ${item.scheduleTime}`,
            mediaCount: item.mediaFile ? 1 : 0,
            mediaPath: data.mediaPath || item.mediaFile?.url || null,
            scheduleEpoch: epochSeconds,
          };
          fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...hItem, clientId: activeProject.id }),
          }).catch(() => {});
          createdHistoryItems.push(hItem);
        } else {
          failCount++;
          const failedMsg = data.errors ? Object.values(data.errors).join(", ") : data.error || "Schedule error";
          const fItem: PostHistoryItem = {
            id: "post_" + Date.now() + "_" + i,
            projectName: activeProject.name,
            platforms: selectedList,
            postType: item.postType,
            caption: item.caption,
            status: "failed",
            errorMessage: failedMsg,
            time: `Scheduled for ${item.scheduleTime}`,
            mediaCount: item.mediaFile ? 1 : 0,
          };
          fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...fItem, clientId: activeProject.id }),
          }).catch(() => {});
          createdHistoryItems.push(fItem);
        }
      } catch (err: any) {
        failCount++;
      }
    }

    setIsPublishing(false);
    setBulkSchedulingStatus(null);
    setPostHistory((prev) => [...createdHistoryItems, ...prev]);

    alert(`🎉 Bulk Scheduling Completed!\n\n✅ Successfully Scheduled: ${successCount} post(s)\n${failCount > 0 ? `❌ Failed: ${failCount} post(s)` : ""}\n\nYou can view your scheduled queue in the 'Queue & History' modal.`);
    
    // Reset bulk list to empty
    setBulkPosts([]);
  };

  const filteredHistory = postHistory.filter((item) => {
    if (historyFilter === "all") return true;
    return item.status === historyFilter;
  });

  const publishedCount = postHistory.filter((i) => i.status === "published").length;
  const scheduledCount = postHistory.filter((i) => i.status === "scheduled").length;
  const failedCount = postHistory.filter((i) => i.status === "failed").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2">
                SocialPost Manager
                <span className="text-[10px] sm:text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                  Unified
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500">Auto aspect-ratio validator & 1-click publishing</p>
            </div>
          </div>

          {/* Desktop Only: Project Selector & Actions in Header */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            {/* Custom Client Selector with Rich Real Platform Icons */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowClientDropdown((prev) => !prev)}
                className="flex items-center bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2.5 py-1.5 gap-2 transition cursor-pointer min-w-[170px]"
              >
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Client:</span>

                {activeProject ? (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {activeProject.name}
                    </span>
                    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                      {activeProject.facebook && (
                        <span className="text-blue-600 inline-flex items-center" title="Facebook Page Connected">
                          <FacebookIcon className="!w-4 !h-4" />
                        </span>
                      )}
                      {activeProject.instagram && (
                        <span className="text-pink-600 inline-flex items-center" title="Instagram Connected">
                          <InstagramIcon className="!w-4 !h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No Client</span>
                )}
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {/* Dropdown Menu */}
              {showClientDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowClientDropdown(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Brand / Client
                    </div>
                    {projects.length === 0 ? (
                      <div className="px-3 py-3 text-xs text-slate-400 text-center">
                        No clients found.
                      </div>
                    ) : (
                      projects.map((proj) => (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => {
                            setActiveProjectId(proj.id);
                            setTargetPlatforms({
                              facebook: !!proj.facebook,
                              instagram: !!proj.instagram,
                              gbp: !!proj.gbp,
                            });
                            setShowClientDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition cursor-pointer ${
                            proj.id === activeProjectId
                              ? "bg-blue-50 text-blue-900 font-bold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="truncate">{proj.name}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            {proj.facebook && (
                              <span className="text-blue-600 inline-flex items-center" title="Facebook">
                                <FacebookIcon className="!w-3.5 !h-3.5" />
                              </span>
                            )}
                            {proj.instagram && (
                              <span className="text-pink-600 inline-flex items-center" title="Instagram">
                                <InstagramIcon className="!w-3.5 !h-3.5" />
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition shadow-xs cursor-pointer"
            >
              <History className="h-3.5 w-3.5 text-slate-600" />
              <span className="hidden xs:inline">Queue</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full font-bold">
                {postHistory.length}
              </span>
            </button>

            <button
              onClick={() => setShowManageModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition shadow-xs cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-slate-600" />
              <span className="hidden xs:inline">Manage</span> ({projects.length})
            </button>

            <button
              onClick={() => {
                setEditingClientId(null);
                setClientForm({
                  name: "",
                  platforms: {
                    facebook: true,
                    instagram: false,
                    gbp: false,
                  },
                  fbPageName: "",
                  fbPageId: "",
                  fbPasswordOrToken: "",
                  igUsername: "",
                  igAccountId: "",
                  igPasswordOrToken: "",
                  gbpLocationName: "",
                  gbpAccountId: "",
                  gbpLocationId: "",
                  gbpAccessToken: "",
                });
                setVerificationFeedback(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition shadow-xs cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Add</span> Client
            </button>
          </div>
        </div>

        {/* Mobile Only: Client Name Selector prominent at the top */}
        <div className="mt-2.5 sm:hidden">
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setShowClientDropdown((prev) => !prev)}
              className="w-full flex items-center justify-between bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl px-3 py-2 transition cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-slate-500 font-semibold">Client:</span>
                {activeProject ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {activeProject.name}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {activeProject.facebook && (
                        <span className="text-blue-600 inline-flex items-center" title="Facebook Connected">
                          <FacebookIcon className="!w-3.5 !h-3.5" />
                        </span>
                      )}
                      {activeProject.instagram && (
                        <span className="text-pink-600 inline-flex items-center" title="Instagram Connected">
                          <InstagramIcon className="!w-3.5 !h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No Client Selected</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-bold ml-2">▼</span>
            </button>

            {/* Mobile Client Dropdown */}
            {showClientDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowClientDropdown(false)}
                />
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Brand / Client
                  </div>
                  {projects.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      No clients found.
                    </div>
                  ) : (
                    projects.map((proj) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => {
                          setActiveProjectId(proj.id);
                          setTargetPlatforms({
                            facebook: !!proj.facebook,
                            instagram: !!proj.instagram,
                            gbp: !!proj.gbp,
                          });
                          setShowClientDropdown(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left flex items-center justify-between text-xs transition cursor-pointer ${
                          proj.id === activeProjectId
                            ? "bg-blue-50 text-blue-900 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="truncate">{proj.name}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {proj.facebook && (
                            <span className="text-blue-600 inline-flex items-center">
                              <FacebookIcon className="!w-3.5 !h-3.5" />
                            </span>
                          )}
                          {proj.instagram && (
                            <span className="text-pink-600 inline-flex items-center">
                              <InstagramIcon className="!w-3.5 !h-3.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout (Extra bottom padding on mobile for fixed bottom bar) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Post Composer (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Composer Mode Switcher: Single Post vs Bulk Multi-Day Scheduler */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setComposerMode("single")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                composerMode === "single"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              Create Post
            </button>
            <button
              type="button"
              onClick={() => setComposerMode("bulk")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                composerMode === "bulk"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Multi Post Schedule
              {bulkPosts.length > 0 && (
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-semibold">
                  {bulkPosts.length}
                </span>
              )}
            </button>
          </div>

          {/* Step 1: Target Accounts */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                Where to publish? ({activeProject?.name || "No Client"})
              </label>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Ready to Post
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3">
              {/* Facebook */}
              {activeProject?.facebook ? (
                <button
                  type="button"
                  onClick={() => togglePlatform("facebook")}
                  className={`flex items-center p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    targetPlatforms.facebook
                      ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-slate-900"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3 ${
                    targetPlatforms.facebook ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"
                  }`}>
                    <FacebookIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Facebook Page</span>
                      {targetPlatforms.facebook && (
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {activeProject.facebook.pageName}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mr-3 text-slate-300">
                    <FacebookIcon />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-400">Facebook Page</span>
                    <span className="text-[10px] text-slate-400">Not configured</span>
                  </div>
                </div>
              )}

              {/* Instagram */}
              {activeProject?.instagram ? (
                <button
                  type="button"
                  onClick={() => togglePlatform("instagram")}
                  className={`flex items-center p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    targetPlatforms.instagram
                      ? "bg-pink-50/70 border-pink-500 ring-2 ring-pink-500/20 text-slate-900"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3 ${
                    targetPlatforms.instagram
                      ? "bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    <InstagramIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Instagram</span>
                      {targetPlatforms.instagram && (
                        <CheckCircle2 className="h-4 w-4 text-pink-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      @{activeProject.instagram.username}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mr-3 text-slate-300">
                    <InstagramIcon />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-400">Instagram</span>
                    <span className="text-[10px] text-slate-400">Not configured</span>
                  </div>
                </div>
              )}

              {/* Google Business Profile */}
              {activeProject?.gbp ? (
                <button
                  type="button"
                  onClick={() => togglePlatform("gbp")}
                  className={`flex items-center p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    targetPlatforms.gbp
                      ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3 ${
                    targetPlatforms.gbp
                      ? "bg-white border border-slate-200 shadow-sm"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    <GoogleBusinessIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Google Business</span>
                      {targetPlatforms.gbp && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {activeProject.gbp.locationName || "Connected"}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mr-3 opacity-60">
                    <GoogleBusinessIcon />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-400">Google Business</span>
                    <span className="text-[10px] text-slate-400">Not configured</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {composerMode === "single" ? (
            <>
              {/* Step 2: Content Type Selection */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                Format & Aspect Ratio Guidelines
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setPostType("poster");
                  if (mediaFiles.length > 1) setMediaFiles(mediaFiles.slice(0, 1));
                }}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border text-xs transition cursor-pointer ${
                  postType === "poster"
                    ? "bg-blue-50 border-blue-600 text-blue-800 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <span>Poster (Photo)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">FB: 1:1 | IG: 4:5 / 1:1</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPostType("reel");
                  if (mediaFiles.length > 1) setMediaFiles(mediaFiles.slice(0, 1));
                }}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border text-xs transition cursor-pointer ${
                  postType === "reel"
                    ? "bg-purple-50 border-purple-600 text-purple-800 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-purple-600" />
                  <span>Reel / Video</span>
                </div>
                <span className="text-[10px] text-purple-600 font-bold">Requires 9:16 Vertical</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType("carousel")}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border text-xs transition cursor-pointer ${
                  postType === "carousel"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-800 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <span>Carousel</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Multi-image slides</span>
              </button>
            </div>
          </div>

          {/* Step 3: Media Upload with Smart Ratio Inspector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
                Upload & Aspect Ratio Inspector
              </label>
              <span className="text-xs font-semibold text-blue-600">
                {postType === "reel" ? "Target: 9:16 Video" : targetPlatforms.instagram ? "Target: 4:5 or 1:1" : "Target: 1:1 Square"}
              </span>
            </div>

            {/* Media Upload Box */}
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition bg-slate-50/50">
              <input
                type="file"
                id="mediaUpload"
                multiple={postType === "carousel"}
                accept={postType === "reel" ? "video/*" : "image/*,video/*"}
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="mediaUpload"
                className="cursor-pointer flex flex-col items-center justify-center gap-2 py-3"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 hover:underline">Select file to inspect & upload</span>
                  <span className="text-xs text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {postType === "reel" ? "Upload MP4/MOV • Auto-validates 9:16" : "Upload PNG/JPG • Auto-validates 1:1 / 4:5"}
                </p>
              </label>
            </div>

            {/* Aspect Ratio Validation Feedback Card */}
            {mediaFiles.length > 0 && (
              <div className="space-y-2">
                {mediaFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      item.isValidRatio
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                        : "bg-amber-50 border-amber-300 text-amber-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-300 bg-white flex-shrink-0">
                        {item.type === "video" ? (
                          <video src={item.url} className="h-full w-full object-cover" />
                        ) : (
                          <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{item.name}</span>
                          {item.isValidRatio ? (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Ratio OK
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Ratio Warning
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.ratioLabel}</p>
                        {item.ratioWarning && (
                          <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                            {item.ratioWarning}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Caption Input with Character Count */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Post Caption ({caption.length}/2,200)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCaption(
                      (prev) =>
                        prev +
                        (prev ? "\n\n" : "") +
                        `✨ Fresh update from ${activeProject?.name || "our brand"}!\nCheck out our latest release.\n\n#${(activeProject?.name || "Brand").replace(/\s+/g, "")} #Updates`
                    )
                  }
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" /> Quick Caption
                </button>
              </div>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your post caption, tags, and description..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Step 4: Schedule & Publish Button */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">Schedule Post (Optional)</span>
              </div>
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {isScheduled && (
              <div className="pt-1 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    min={(() => {
                      const d = new Date(Date.now() + 12 * 60000);
                      const year = d.getFullYear();
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const day = String(d.getDate()).padStart(2, "0");
                      const hours = String(d.getHours()).padStart(2, "0");
                      const mins = String(d.getMinutes()).padStart(2, "0");
                      return `${year}-${month}-${day}T${hours}:${mins}`;
                    })()}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full sm:w-auto bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
                  />
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5 text-blue-600" /> Auto-publishes at scheduled time
                  </span>
                </div>

                {/* Helpful Meta Guideline Note */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Facebook Requirement:</span> Schedule time must be <strong>at least 10 minutes in the future</strong> (e.g. at least 15–20 mins later) and up to 75 days in advance.
                  </div>
                </div>
              </div>
            )}

            {publishSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{publishSuccess}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isPublishing || isCheckingRatio}
              onClick={handlePublish}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isPublishing ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isPublishing
                ? "Publishing to Meta..."
                : isScheduled
                ? "Confirm & Schedule Post"
                : "Publish Now"}
            </button>
          </div>
        </>
      ) : (
        /* BULK MULTI-POST SCHEDULER VIEW */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  Multi Post & Weekly Schedule Planner
                </h3>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Plan an entire week of posts with 1 click, or add individual post slots.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateFullWeek(dailyPostTime)}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Generate a full 7-day schedule with posts every day at the same fixed time"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Plan Full Week (7 Days)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextDays = bulkPosts.length;
                    const [h, m] = dailyPostTime.split(":").map(Number);
                    const d = new Date();
                    d.setDate(d.getDate() + nextDays + 1);
                    d.setHours(h || 18, m || 0, 0, 0);
                    const newTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                    setBulkPosts((prev) => [
                      ...prev,
                      {
                        id: "bulk_" + Date.now(),
                        postType: "poster",
                        caption: "",
                        mediaFile: null,
                        scheduleTime: newTime,
                        isCustomScheduled: true,
                      },
                    ]);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Post Slot
                </button>
              </div>
            </div>

            {/* Same Daily Time Controller */}
            <div className="bg-white/90 backdrop-blur-xs border border-indigo-100 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-950 font-semibold">
                <Clock className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <span>Daily Fixed Time:</span>
                <input
                  type="time"
                  value={dailyPostTime}
                  onChange={(e) => {
                    const newT = e.target.value;
                    setDailyPostTime(newT);
                    if (bulkPosts.length > 0) {
                      handleApplyTimeToAllSlots(newT);
                    }
                  }}
                  className="bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-lg px-2 py-1 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">
                  (Automatically applies to every day)
                </span>
              </div>

              {bulkPosts.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleApplyTimeToAllSlots(dailyPostTime)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ⚡ Sync {dailyPostTime} to all {bulkPosts.length} days
                </button>
              )}
            </div>
          </div>

          {/* List of Bulk Post Cards or Empty State */}
          {bulkPosts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Multi Post & Weekly Schedule Planner</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Easily schedule your content for the entire week at the same daily time, or add slots manually.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleGenerateFullWeek(dailyPostTime)}
                  className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Plan Full Week (7 Days at {dailyPostTime})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(Date.now() + 2 * 3600000);
                    const newTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:00`;
                    setBulkPosts([
                      {
                        id: "bulk_" + Date.now(),
                        postType: "poster",
                        caption: "",
                        mediaFile: null,
                        scheduleTime: newTime,
                        isCustomScheduled: true,
                      },
                    ]);
                  }}
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add 1 Post Slot
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bulkPosts.map((postCard, idx) => {
                const postDate = new Date(postCard.scheduleTime);
                const isDateValid = !isNaN(postDate.getTime());
                const dayLabel = isDateValid
                  ? postDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                  : `Day ${idx + 1}`;
                const timeLabel = isDateValid
                  ? postDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "";

                return (
                  <div
                    key={postCard.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5 relative"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">
                            {dayLabel} {timeLabel ? `• ${timeLabel}` : ""}
                          </span>
                          <span className="text-[10px] text-indigo-600 font-semibold">
                            Day {idx + 1} of {bulkPosts.length}
                          </span>
                        </div>
                      </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={postCard.postType}
                        onChange={(e) => {
                          const val = e.target.value as "poster" | "reel";
                          setBulkPosts((prev) =>
                            prev.map((p) => (p.id === postCard.id ? { ...p, postType: val } : p))
                          );
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 px-2 py-1 focus:outline-none"
                      >
                        <option value="poster">Poster (1:1 / 4:5)</option>
                        <option value="reel">Reels (9:16)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setBulkPosts((prev) => prev.filter((p) => p.id !== postCard.id))}
                        className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Remove this post slot"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                {/* Schedule Date & Time Picker */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span>Publish Time:</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={postCard.scheduleTime}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBulkPosts((prev) =>
                        prev.map((p) => (p.id === postCard.id ? { ...p, scheduleTime: val } : p))
                      );
                    }}
                    className="bg-white border border-slate-300 text-xs text-slate-900 rounded-md px-2.5 py-1.5 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Media Upload for this post card */}
                <div>
                  {postCard.mediaFile ? (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0">
                          {postCard.mediaFile.type === "video" ? (
                            <video src={postCard.mediaFile.url} className="h-full w-full object-cover" />
                          ) : (
                            <img src={postCard.mediaFile.url} alt="file" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {postCard.mediaFile.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {postCard.mediaFile.ratioLabel}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setBulkPosts((prev) =>
                            prev.map((p) => (p.id === postCard.id ? { ...p, mediaFile: null } : p))
                          )
                        }
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-300 hover:border-indigo-400 rounded-lg p-3 text-center bg-slate-50/50">
                      <input
                        type="file"
                        id={`bulk_media_${postCard.id}`}
                        accept={postCard.postType === "reel" ? "video/*" : "image/*,video/*"}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const isVid = f.type.startsWith("video");
                          const u = URL.createObjectURL(f);
                          const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
                            if (isVid) {
                              const v = document.createElement("video");
                              v.preload = "metadata";
                              v.onloadedmetadata = () => resolve({ width: v.videoWidth || 1080, height: v.videoHeight || 1920 });
                              v.src = u;
                            } else {
                              const img = new Image();
                              img.onload = () => resolve({ width: img.naturalWidth || 1080, height: img.naturalHeight || 1080 });
                              img.src = u;
                            }
                          });
                          const validation = validateAspectRatio(width, height, isVid ? "video" : "image", postCard.postType);
                          const mItem: MediaFileItem = {
                            url: u,
                            name: f.name,
                            file: f,
                            type: isVid ? "video" : "image",
                            width,
                            height,
                            aspectRatio: width / height,
                            ratioLabel: validation.label,
                            isValidRatio: validation.isValid,
                            ratioWarning: validation.warning,
                          };
                          setBulkPosts((prev) =>
                            prev.map((p) => (p.id === postCard.id ? { ...p, mediaFile: mItem } : p))
                          );
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`bulk_media_${postCard.id}`}
                        className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1.5"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Select Photo / Video for Post {idx + 1}
                      </label>
                    </div>
                  )}
                </div>

                {/* Caption for this post card */}
                <textarea
                  rows={2}
                  value={postCard.caption}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBulkPosts((prev) =>
                      prev.map((p) => (p.id === postCard.id ? { ...p, caption: val } : p))
                    );
                  }}
                  placeholder={`Caption for Post ${idx + 1}...`}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            );
          })}
          </div>
          )}

          {/* Submit All Bulk Posts Button */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            {bulkSchedulingStatus && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800 text-xs flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold">{bulkSchedulingStatus}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isPublishing || bulkPosts.length === 0}
              onClick={handleBulkSchedule}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isPublishing ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              {isPublishing
                ? "Processing Queue..."
                : bulkPosts.length === 0
                ? "Add a post slot above to schedule"
                : `Schedule All (${bulkPosts.length}) Posts in Queue`}
            </button>
          </div>
        </div>
      )}
        </div>

        {/* Right Column: Live Mockup Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Post & Comment Preview</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs">
              Instagram Mockup
            </div>
          </div>

          {/* Social Card Mockup */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm sticky top-20">
            {/* Header */}
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5">
                  <div className="h-full w-full bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-800">
                    {activeProject?.name.slice(0, 1) || "P"}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {activeProject?.instagram?.username || (activeProject?.name.toLowerCase().replace(/\s+/g, "_") || "client_page")}
                  </h4>
                  <p className="text-[10px] text-slate-400">{activeProject?.name || "Client"} • {activeProject?.connectMode.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-slate-400 text-xs">•••</div>
            </div>

            {/* Media Area */}
            <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
              {mediaFiles.length > 0 ? (
                mediaFiles[0].type === "video" ? (
                  <video src={mediaFiles[0].url} controls className="h-full w-full object-cover" />
                ) : (
                  <img src={mediaFiles[0].url} alt="Preview" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">Media Preview</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Poster (1:1/4:5) or Reel (9:16)</p>
                </div>
              )}

              {postType === "carousel" && mediaFiles.length > 1 && (
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  1/{mediaFiles.length}
                </div>
              )}
            </div>

            {/* Caption & Actions */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-sm cursor-pointer">❤️</span>
                  <span className="text-sm cursor-pointer">💬</span>
                  <span className="text-sm cursor-pointer">↗️</span>
                </div>
                <span className="text-sm cursor-pointer">🔖</span>
              </div>

              <div className="text-xs text-slate-800">
                <span className="font-bold mr-1.5">
                  {activeProject?.instagram?.username || (activeProject?.name.toLowerCase().replace(/\s+/g, "_") || "client_page")}
                </span>
                <span className="whitespace-pre-line text-slate-600">
                  {caption || "Caption preview will appear here..."}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 uppercase pt-1">Automated via Meta Graph API</div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Post History & Queue */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Content Feed & Scheduled Posts
                  </h3>
                  <p className="text-[11px] text-slate-500">Live preview of published and scheduled multi-platform posts</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setHistoryFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    historyFilter === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Posts ({livePosts.length > 0 ? livePosts.length : postHistory.length})
                </button>

                <button
                  onClick={() => setHistoryFilter("scheduled")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    historyFilter === "scheduled"
                      ? "bg-amber-600 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Scheduled Queue ({livePosts.filter((p) => p.status === "scheduled").length || scheduledCount})
                </button>

                <button
                  onClick={() => setHistoryFilter("published")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    historyFilter === "published"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Live Published ({livePosts.filter((p) => p.status === "published").length || publishedCount})
                </button>

                <button
                  onClick={() => setHistoryFilter("failed")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    historyFilter === "failed"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Failed ({failedCount})
                </button>
              </div>

              <button
                type="button"
                disabled={isLoadingLiveFeed}
                onClick={() => fetchLiveFeed(activeProjectId)}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="Refresh Live Data from Facebook & Instagram Graph API"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLiveFeed ? "animate-spin" : ""}`} />
                <span>{isLoadingLiveFeed ? "Syncing..." : "Sync Live Meta Data"}</span>
              </button>
            </div>

            {/* List of Posts in Modern Card Grid UI with REAL Meta Media, Likes & Comments */}
            <div className="overflow-y-auto flex-1 pr-1">
              {isLoadingLiveFeed ? (
                <div className="text-center py-20 text-slate-500 space-y-2">
                  <div className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold">Syncing live posts, photos, likes & comments directly from Meta Graph API...</p>
                </div>
              ) : (
                (() => {
                  const displayList = livePosts.length > 0 ? livePosts : postHistory;
                  const finalFiltered = displayList.filter((item) => {
                    if (historyFilter === "all") return true;
                    return item.status === historyFilter;
                  });

                  if (finalFiltered.length === 0) {
                    return (
                      <div className="text-center py-16 text-slate-400">
                        <Filter className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-medium">No {historyFilter} posts found in your feed.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                      {finalFiltered.map((item) => {
                        const imgUrl = item.mediaUrl || item.mediaPath || null;
                        const isVideo = item.isVideo || item.postType === "reel";
                        const isInsta = item.platform === "instagram" || item.platforms?.includes("instagram");
                        const isFb = item.platform === "facebook" || item.platforms?.includes("facebook");

                        return (
                          <div
                            key={item.id}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                          >
                            {/* Real Meta Media Header / Preview Area */}
                            <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                              {imgUrl ? (
                                isVideo ? (
                                  <video src={imgUrl} className="w-full h-full object-cover" controls />
                                ) : (
                                  <img
                                    src={imgUrl}
                                    alt="Meta post media"
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    onError={(e) => {
                                      // Fallback on broken remote CDN
                                      (e.target as any).style.display = "none";
                                    }}
                                  />
                                )
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
                                  {isVideo ? (
                                    <Video className="h-8 w-8 text-indigo-400 mb-1" />
                                  ) : (
                                    <ImageIcon className="h-8 w-8 text-indigo-400 mb-1" />
                                  )}
                                  <span className="text-[11px] font-bold text-white/90 truncate max-w-[90%]">
                                    {item.projectName}
                                  </span>
                                  <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">
                                    {item.postType}
                                  </span>
                                </div>
                              )}

                              {/* Top floating badges */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                {item.status === "scheduled" && (
                                  <span className="text-[10px] bg-amber-500/95 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                                    <Clock className="h-3 w-3" /> Scheduled
                                  </span>
                                )}
                                {item.status === "published" && (
                                  <span className="text-[10px] bg-emerald-600/95 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                                    <CheckCircle2 className="h-3 w-3" /> Published
                                  </span>
                                )}
                                {item.status === "failed" && (
                                  <span className="text-[10px] bg-red-600/95 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                                    <XCircle className="h-3 w-3" /> Failed
                                  </span>
                                )}
                              </div>

                              {/* Top-right platform indicators */}
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-lg text-white">
                                {isFb && <FacebookIcon className="!w-3 !h-3" />}
                                {isInsta && <InstagramIcon className="!w-3 !h-3" />}
                              </div>
                            </div>

                            {/* Card Content with REAL Meta Stats */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                              <div className="space-y-1.5">
                                {/* Platform + Date Row */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                  {isInsta ? (
                                    <InstagramIcon className="!w-3.5 !h-3.5 text-pink-600" />
                                  ) : (
                                    <FacebookIcon className="!w-3.5 !h-3.5 text-blue-600" />
                                  )}
                                  <span className="font-semibold text-slate-700 truncate">{item.time}</span>
                                  <span>•</span>
                                  <span className="capitalize">{item.postType}</span>
                                </div>

                                {/* Caption */}
                                <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed">
                                  {item.caption || (item.mediaUrl ? "Photo / Media Post" : "No caption provided")}
                                </p>

                                {/* REAL Engagement Metrics directly from Facebook/Instagram API */}
                                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600 font-medium">
                                  <span className="flex items-center gap-1" title="Views">
                                    👁️ {item.views ?? 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-pink-700" title="Real Likes">
                                    ❤️ {item.likes ?? 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-700" title="Real Comments">
                                    💬 {item.comments ?? 0}
                                  </span>
                                </div>
                              </div>

                              {/* Error box if failed */}
                              {item.errorMessage && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-700">
                                  {item.errorMessage}
                                </div>
                              )}

                              {/* Action Buttons: Repost now, Edit, Open, Delete */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRepost(item)}
                                  className="flex-1 py-1.5 px-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Repost now
                                </button>

                                <button
                                  type="button"
                                  disabled={isInsta}
                                  onClick={(e) => !isInsta && handleEditPostCaption(item, e)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isInsta
                                      ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50"
                                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                                  }`}
                                  title={
                                    isInsta
                                      ? "Instagram API caption editing is restricted by Meta. Use 'Repost now' or edit in the Instagram app."
                                      : "Edit Caption (Syncs directly to Facebook Page)"
                                  }
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.permalink) {
                                      window.open(item.permalink, "_blank");
                                    } else {
                                      window.open(isInsta ? "https://instagram.com" : "https://facebook.com", "_blank");
                                    }
                                  }}
                                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition cursor-pointer"
                                  title="View Live Post on Meta"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  disabled={isInsta && item.status !== "scheduled"}
                                  onClick={(e) => {
                                    if (isInsta && item.status !== "scheduled") return;
                                    handleDeletePost(item, e);
                                  }}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isInsta && item.status !== "scheduled"
                                      ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50"
                                      : "bg-white border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-500 cursor-pointer"
                                  }`}
                                  title={
                                    isInsta && item.status !== "scheduled"
                                      ? "Instagram live posts must be deleted directly inside the official Instagram app."
                                      : "Delete Post (Deletes Live from Facebook & Queue)"
                                  }
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Total {filteredHistory.length} post(s) found
              </span>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Client Management */}
      {showManageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Client Management ({projects.length})
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {projects.map((client) => (
                <div key={client.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {client.name}
                        {client.facebook && (
                          <span className="text-blue-600 inline-flex items-center" title="Facebook Connected">
                            <FacebookIcon className="!w-3.5 !h-3.5" />
                          </span>
                        )}
                        {client.instagram && (
                          <span className="text-pink-600 inline-flex items-center" title="Instagram Connected">
                            <InstagramIcon className="!w-3.5 !h-3.5" />
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono uppercase">
                        {client.connectMode}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 mt-1">
                      {client.facebook && (
                        <span className="flex items-center gap-1 text-blue-700">
                          <FacebookIcon /> {client.facebook.pageName} (ID: {client.facebook.pageId || "N/A"})
                        </span>
                      )}
                      {client.facebook && client.instagram && <span>•</span>}
                      {client.instagram && (
                        <span className="flex items-center gap-1 text-pink-700">
                          <InstagramIcon /> @{client.instagram.username}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setShowManageModal(false);
                        openEditClient(client);
                      }}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                      title="Edit Client"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                      title="Delete Client"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowManageModal(false);
                  setEditingClientId(null);
                  setClientForm({
                    name: "",
                    platforms: {
                      facebook: true,
                      instagram: false,
                      gbp: false,
                    },
                    fbPageName: "",
                    fbPageId: "",
                    fbPasswordOrToken: "",
                    igUsername: "",
                    igAccountId: "",
                    igPasswordOrToken: "",
                    gbpLocationName: "",
                    gbpAccountId: "",
                    gbpLocationId: "",
                    gbpAccessToken: "",
                  });
                  setVerificationFeedback(null);
                  setShowAddModal(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" /> + Add Another Client
              </button>

              <button
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create & Update Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                {editingClientId ? <Edit2 className="h-5 w-5 text-blue-600" /> : <PlusCircle className="h-5 w-5 text-blue-600" />}
                {editingClientId ? "Edit Client Credentials" : "Connect New Client"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Smart 1-Click Meta Login Option & Auto-Discovery */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 p-0.5 rounded-2xl shadow-sm">
              <div className="bg-white p-3.5 rounded-[14px] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        1-Click Auto-Connect
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full font-semibold">Easy</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Auto-detect Facebook Page ID, Instagram ID & Tokens</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isAutoImporting}
                    onClick={handleMetaOAuthLogin}
                    className="w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <FacebookIcon className="!w-3.5 !h-3.5" />
                    {isAutoImporting ? "Connecting..." : "Login with Facebook"}
                  </button>
                </div>

                {/* Quick Token Paste & Auto-Fetch fallback */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={autoTokenInput}
                      onChange={(e) => setAutoTokenInput(e.target.value)}
                      placeholder="Or paste any Meta / Graph Token to auto-fetch..."
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      disabled={isAutoImporting || !autoTokenInput.trim()}
                      onClick={() => triggerAutoDiscovery(autoTokenInput)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition cursor-pointer disabled:opacity-40 shrink-0"
                    >
                      {isAutoImporting ? "Fetching..." : "Auto-Fetch"}
                    </button>
                  </div>
                </div>

                {/* Discovered Accounts Dropdown Selector if multiple found */}
                {discoveredPages.length > 1 && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 animate-fadeIn">
                    <label className="text-[11px] font-bold text-blue-900 block">
                      Choose which Page / Brand to configure:
                    </label>
                    <select
                      className="w-full bg-white border border-blue-300 rounded-lg p-2 text-xs text-slate-900 font-medium"
                      onChange={(e) => {
                        const selected = discoveredPages.find((p) => p.fbPageId === e.target.value);
                        if (selected) {
                          setClientForm((prev) => ({
                            ...prev,
                            name: selected.fbPageName,
                            platformType: selected.hasInstagram ? "both" : "facebook",
                            fbPageName: selected.fbPageName,
                            fbPageId: selected.fbPageId,
                            fbPasswordOrToken: selected.fbToken,
                            igUsername: selected.igUsername || "",
                            igAccountId: selected.igAccountId || "",
                            igPasswordOrToken: selected.igToken || selected.fbToken,
                          }));
                        }
                      }}
                    >
                      {discoveredPages.map((page) => (
                        <option key={page.fbPageId} value={page.fbPageId}>
                          {page.fbPageName} {page.hasInstagram ? `(Linked IG: @${page.igUsername})` : "(FB Only)"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Client / Brand Name *
                </label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  placeholder="e.g. Nike Bangladesh, Apex Footwear"
                  className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Individual Platform Toggles */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Select Platform(s) for this client:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setClientForm((prev) => ({
                        ...prev,
                        platforms: { ...prev.platforms, facebook: !prev.platforms.facebook },
                      }))
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      clientForm.platforms.facebook
                        ? "bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <div className={clientForm.platforms.facebook ? "text-blue-600" : "text-slate-300"}>
                      <FacebookIcon />
                    </div>
                    <span>Facebook</span>
                    {clientForm.platforms.facebook && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600 ml-auto" />
                    )}
                  </button>

                  {/* Instagram Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setClientForm((prev) => ({
                        ...prev,
                        platforms: { ...prev.platforms, instagram: !prev.platforms.instagram },
                      }))
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      clientForm.platforms.instagram
                        ? "bg-pink-50 border-pink-600 text-pink-900 ring-2 ring-pink-500/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <div className={clientForm.platforms.instagram ? "text-pink-600" : "text-slate-300"}>
                      <InstagramIcon />
                    </div>
                    <span>Instagram</span>
                    {clientForm.platforms.instagram && (
                      <CheckCircle2 className="h-4 w-4 text-pink-600 ml-auto" />
                    )}
                  </button>

                  {/* Google Business Profile Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setClientForm((prev) => ({
                        ...prev,
                        platforms: { ...prev.platforms, gbp: !prev.platforms.gbp },
                      }))
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      clientForm.platforms.gbp
                        ? "bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <div className={clientForm.platforms.gbp ? "opacity-100" : "opacity-40"}>
                      <GoogleBusinessIcon />
                    </div>
                    <span>Google (GBP)</span>
                    {clientForm.platforms.gbp && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 ml-auto" />
                    )}
                  </button>
                </div>
              </div>

              {/* Facebook Connection Box */}
              {clientForm.platforms.facebook && (
                <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-2">
                      <FacebookIcon /> Facebook Page Credentials
                    </span>
                    <span className="text-[10px] text-blue-600 font-normal">Page ID + Password/Token</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Facebook Page Name
                    </label>
                    <input
                      type="text"
                      value={clientForm.fbPageName}
                      onChange={(e) => setClientForm({ ...clientForm, fbPageName: e.target.value })}
                      placeholder="e.g. Apex Official Page"
                      className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        Facebook Page ID
                      </label>
                      <input
                        type="text"
                        value={clientForm.fbPageId}
                        onChange={(e) => setClientForm({ ...clientForm, fbPageId: e.target.value })}
                        placeholder="e.g. 1029384756"
                        className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        Page Token or Password
                      </label>
                      <input
                        type="password"
                        value={clientForm.fbPasswordOrToken}
                        onChange={(e) => setClientForm({ ...clientForm, fbPasswordOrToken: e.target.value })}
                        placeholder="EAAB... or Secret Key"
                        className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram Connection Box */}
              {clientForm.platforms.instagram && (
                <div className="p-3.5 bg-pink-50/50 border border-pink-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-900">
                    <span className="flex items-center gap-2">
                      <InstagramIcon /> Instagram Account Credentials
                    </span>
                    <span className="text-[10px] text-pink-600 font-normal">Username + Password/ID</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        Instagram Username
                      </label>
                      <input
                        type="text"
                        value={clientForm.igUsername}
                        onChange={(e) => setClientForm({ ...clientForm, igUsername: e.target.value })}
                        placeholder="e.g. apex_style (no @)"
                        className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        Instagram Account ID
                      </label>
                      <input
                        type="text"
                        value={clientForm.igAccountId}
                        onChange={(e) => setClientForm({ ...clientForm, igAccountId: e.target.value })}
                        placeholder="e.g. 1784140023"
                        className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-pink-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Instagram Password or Access Token
                    </label>
                    <input
                      type="password"
                      value={clientForm.igPasswordOrToken}
                      onChange={(e) => setClientForm({ ...clientForm, igPasswordOrToken: e.target.value })}
                      placeholder="Enter client password or API token"
                      className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Google Business Profile Connection Box */}
              {clientForm.platforms.gbp && (
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-2">
                      <GoogleBusinessIcon /> Google Business Profile (GBP)
                    </span>
                    <span className="text-[10px] text-emerald-600 font-normal">Location ID + OAuth Token</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Business / Location Name
                    </label>
                    <input
                      type="text"
                      value={clientForm.gbpLocationName}
                      onChange={(e) => setClientForm({ ...clientForm, gbpLocationName: e.target.value })}
                      placeholder="e.g. Apex Gulshan Store"
                      className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        Location ID *
                      </label>
                      <input
                        type="text"
                        value={clientForm.gbpLocationId}
                        onChange={(e) => setClientForm({ ...clientForm, gbpLocationId: e.target.value })}
                        placeholder="e.g. 1092837465920"
                        className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        Account ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={clientForm.gbpAccountId}
                        onChange={(e) => setClientForm({ ...clientForm, gbpAccountId: e.target.value })}
                        placeholder="e.g. 108273645"
                        className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Google OAuth / Access Token *
                    </label>
                    <input
                      type="password"
                      value={clientForm.gbpAccessToken}
                      onChange={(e) => setClientForm({ ...clientForm, gbpAccessToken: e.target.value })}
                      placeholder="ya29.a0AfH6SM... Google Access Token"
                      className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded-md p-2 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleVerifyCredentials}
                  disabled={isVerifyingToken}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isVerifyingToken ? "animate-spin" : ""}`} />
                  {isVerifyingToken ? "Verifying with Meta API..." : "Verify & Test Connection"}
                </button>

                {verificationFeedback && (
                  <span className="text-[11px] font-medium text-slate-600">{verificationFeedback}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClient}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                {editingClientId ? "Update Client" : "Connect & Save Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-between gap-2 shadow-lg shadow-slate-900/10">
        {/* Queue & History Button */}
        <button
          type="button"
          onClick={() => setShowHistoryModal(true)}
          className="flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-slate-100 text-slate-700 active:scale-95 transition cursor-pointer"
        >
          <div className="relative">
            <History className="h-4 w-4 text-slate-700" />
            <span className="absolute -top-1.5 -right-2.5 text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">
              {postHistory.length}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-700">History</span>
        </button>

        {/* Manage Clients Button with Count */}
        <button
          type="button"
          onClick={() => setShowManageModal(true)}
          className="flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-slate-100 text-slate-700 active:scale-95 transition cursor-pointer"
        >
          <div className="relative">
            <Users className="h-4 w-4 text-slate-700" />
            <span className="absolute -top-1.5 -right-2.5 text-[9px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full font-bold">
              {projects.length}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-700">Clients</span>
        </button>

        {/* Add Client Action Button */}
        <button
          type="button"
          onClick={() => {
            setEditingClientId(null);
            setClientForm({
              name: "",
              platforms: {
                facebook: true,
                instagram: false,
                gbp: false,
              },
              fbPageName: "",
              fbPageId: "",
              fbPasswordOrToken: "",
              igUsername: "",
              igAccountId: "",
              igPasswordOrToken: "",
              gbpLocationName: "",
              gbpAccountId: "",
              gbpLocationId: "",
              gbpAccessToken: "",
            });
            setVerificationFeedback(null);
            setShowAddModal(true);
          }}
          className="flex-1.5 py-2 px-3 bg-blue-600 active:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>
    </div>
  );
}
