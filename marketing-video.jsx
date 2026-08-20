/* Training journey promo — feed → email → MySBDC → badge → milestone */
const { CompositionStage, useComposition, Shot, Easing, animate, clamp,
        useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;

const SERA = "'proxima-sera',Georgia,serif";
const NOVA = "'proxima-nova',Arial,Helvetica,sans-serif";
const LOGO_WHITE = "https://www.norcalsbdc.org/wp-content/themes/norcal-sbdc/assets/img/logos/americas-sbdc-norcal-white-180h.png";
const NAVY = "#0f1c2d", CREAM = "#f5f1e8", BERRY = "#c23c3c", PAPER = "#fdfdfd", SLATE = "#2c3240", SLATE_L = "#687080", EVGR = "#00675c";

const GOLD = { c: "#c0953f", onNavy: "#d9b56a", ink: "#8f6c24", tint: "#f6efe0" };
const AI = { series: "AI Series", title: "AI Essentials for Operators", meta: "Self-paced · Certification", ...GOLD };
const NEXT = { series: "Growth Series", title: "Capital Ready", meta: "Live cohort · 8 weeks", c: "#1b5faf", onNavy: "#7fb0e8", ink: "#1b5faf" };

const MOTION = {
  enter(T, start, dur = 0.7, dist = 30) {
    const p = clamp((T - start) / dur, 0, 1), e = Easing.easeOutCubic(p);
    return { opacity: e, transform: `translateY(${(1 - e) * dist}px)` };
  },
  pop(T, start, dur = 0.6) {
    const p = clamp((T - start) / dur, 0, 1), e = Easing.easeOutBack(p);
    return { opacity: clamp(p * 3, 0, 1), scale: 0.55 + 0.45 * e };
  },
  fade(T, start, dur = 0.5, from = 0, to = 1) {
    const p = clamp((T - start) / dur, 0, 1);
    return from + (to - from) * Easing.easeInOutSine(p);
  }
};

function Tile({ p, w = 480 }) {
  const s = w / 480, h = w * 9 / 16;
  return (
    <div style={{ width: w, height: h, background: NAVY, color: PAPER, position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box",
      padding: `${18 * s}px ${24 * s}px ${18 * s}px ${32 * s}px`, flex: "none" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 9 * s, background: p.c }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <img src={LOGO_WHITE} alt="" style={{ height: 26 * s, display: "block" }} />
        <span style={{ fontSize: 12 * s, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: p.onNavy, marginTop: 4 * s, fontFamily: NOVA }}>{p.series}</span>
      </div>
      <div>
        <div style={{ fontFamily: SERA, fontSize: 33 * s, letterSpacing: "-.03em", lineHeight: 1.05, textWrap: "balance" }}>{p.title}</div>
        <div style={{ marginTop: 10 * s, fontSize: 13 * s, fontWeight: 700, color: "#ffffff99", fontFamily: NOVA }}>{p.meta} · Free</div>
      </div>
    </div>
  );
}

function SqTile({ p, w = 386 }) {
  const s = w / 370;
  return (
    <div style={{ width: w, height: w, background: NAVY, color: PAPER, position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box",
      padding: `${20 * s}px ${24 * s}px ${22 * s}px ${30 * s}px` }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8 * s, background: p.c }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <img src={LOGO_WHITE} alt="" style={{ height: 30 * s, display: "block" }} />
        <span style={{ fontSize: 12 * s, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: p.onNavy, marginTop: 4 * s }}>{p.series}</span>
      </div>
      <div>
        <div style={{ fontFamily: SERA, fontSize: 40 * s, letterSpacing: "-.03em", lineHeight: 1.04, textWrap: "balance" }}>{p.title}</div>
        <div style={{ marginTop: 12 * s, fontSize: 14 * s, fontWeight: 700, color: "#ffffff99" }}>{p.meta} · Free</div>
      </div>
    </div>
  );
}

function Seal({ p, size = 150 }) {
  const s = size / 150;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `${3 * s}px solid ${p.c}`,
      background: PAPER, boxShadow: `0 0 0 ${10 * s}px #fdfdfd66, 0 24px 50px #0f1c2d40`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 * s }}>
      <span style={{ fontSize: 30 * s, lineHeight: 1, color: p.ink }}>★</span>
      <span style={{ fontSize: 13 * s, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: NAVY, fontFamily: NOVA }}>SBDC</span>
      <span style={{ fontSize: 13 * s, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: p.ink, fontFamily: NOVA }}>Certified</span>
    </div>
  );
}

function Window({ title, x, y, w, h, style, children }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: PAPER,
      border: "1px solid #0f1c2d24", boxShadow: "0 60px 140px #0f1c2d33", overflow: "hidden", ...style }}>
      <div style={{ height: 52, background: "#efefef", display: "flex", alignItems: "center", padding: "0 22px", gap: 9 }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d8d8d8" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d8d8d8" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d8d8d8" }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: SLATE_L, margin: "0 auto" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  const endFade = 1 - MOTION.fade(T, authoredTotal - 0.6, 0.6);
  const caps = { fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", fontFamily: NOVA };

  const openOut = 1 - MOTION.fade(T, CUES.Feed - 0.35, 0.5);
  const openDrift = 1 + 0.02 * clamp(T / (CUES.Feed || 2.5), 0, 1);

  /* Feed */
  const phoneIn = MOTION.enter(T, CUES.Feed + 0.1, 0.8, 90);
  const phoneOutP = MOTION.fade(T, CUES.Email - 0.45, 0.6);
  const phoneScale = 1 + 0.04 * clamp((T - CUES.Feed) / ((CUES.Email - CUES.Feed) || 5), 0, 1);
  const heart = MOTION.pop(T, CUES.Feed + 2.6, 0.55);
  const likes = Math.round(96 + 28 * MOTION.fade(T, CUES.Feed + 2.6, 1.6));

  /* Email */
  const mailIn = MOTION.enter(T, CUES.Email + 0.1, 0.8, 70);
  const mailOutP = MOTION.fade(T, CUES.Register - 0.45, 0.6);
  const mailDrift = animate({ from: 0, to: -70, start: CUES.Email + 1.2, end: CUES.Register - 0.6, ease: Easing.easeInOutSine })(T);

  /* Register — cursor clicks the button at clickT */
  const clickT = CUES.Register + 2.9;
  const dashIn = MOTION.enter(T, CUES.Register + 0.1, 0.8, 70);
  const dashOutP = MOTION.fade(T, CUES.Badge - 0.45, 0.6);
  const curX = animate({ from: 1560, to: 1203, start: CUES.Register + 1.2, end: CUES.Register + 2.6, ease: Easing.easeInOutCubic })(T);
  const curY = animate({ from: 960, to: 668, start: CUES.Register + 1.2, end: CUES.Register + 2.6, ease: Easing.easeInOutCubic })(T);
  const clicked = T >= clickT;
  const press = 1 - 0.05 * (clamp((T - clickT) / 0.12, 0, 1) * (1 - clamp((T - clickT - 0.12) / 0.15, 0, 1)));
  const rippleP = clamp((T - clickT) / 0.55, 0, 1);

  /* Badge */
  const cardIn = MOTION.enter(T, CUES.Badge + 0.15, 0.8, 60);
  const cardOutP = MOTION.fade(T, CUES.Milestone - 0.4, 0.5);
  const seal = MOTION.pop(T, CUES.Badge + 1.1, 0.7);
  const sealRot = -14 * (1 - clamp((T - (CUES.Badge + 1.1)) / 0.7, 0, 1));

  /* Milestone */
  const mileOut = 1 - MOTION.fade(T, CUES.Close - 0.2, 0.5);
  const statPop = MOTION.pop(T, CUES.Milestone + 0.8, 0.8);
  const mileDrift = 1 + 0.025 * clamp((T - CUES.Milestone) / ((CUES.Close - CUES.Milestone) || 4.5), 0, 1);

  /* Close */
  const closeBg = Math.min(MOTION.fade(T, CUES.Close, 0.7), endFade);
  const closeDrift = 1 + 0.02 * clamp((T - CUES.Close) / ((authoredTotal - CUES.Close) || 3), 0, 1);

  const CAPS = [
    { at: CUES.Feed + 0.8, until: CUES.Email - 0.4, text: "01 · Seen in the feed" },
    { at: CUES.Email + 0.8, until: CUES.Register - 0.4, text: "02 · Landed in the send" },
    { at: CUES.Register + 0.8, until: CUES.Badge - 0.4, text: "03 · One click in MySBDC" },
    { at: CUES.Badge + 0.8, until: CUES.Milestone - 0.4, text: "04 · Certified" },
    { at: CUES.Milestone + 0.5, until: CUES.Close - 0.3, text: "05 · Counted as impact" }
  ];
  const cap = CAPS.find((c) => T >= c.at && T < c.until);

  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, overflow: "hidden", fontFamily: NOVA, color: NAVY }}>
      <Shot from={0} to={CUES.Feed + 0.4}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center", opacity: openOut, transform: `scale(${openDrift})` }}>
          <div style={{ ...caps, fontSize: 22, color: BERRY, ...MOTION.enter(T, 0.25) }}>NorCal SBDC · Training 2027</div>
          <div style={{ fontFamily: SERA, fontSize: 122, letterSpacing: "-.05em", lineHeight: 0.98, marginTop: 36, ...MOTION.enter(T, 0.5, 0.8) }}>One card.</div>
          <div style={{ fontFamily: SERA, fontSize: 122, letterSpacing: "-.05em", lineHeight: 0.98, marginTop: 8, ...MOTION.enter(T, 0.75, 0.8) }}>One journey.</div>
        </div>
      </Shot>
      <Shot from={CUES.Feed - 0.2} to={CUES.Email + 0.4}>
        <div style={{ position: "absolute", left: 758, top: 96, width: 404, height: 862, borderRadius: 50,
          background: PAPER, border: "9px solid #0f1c2d", boxShadow: "0 60px 140px #0f1c2d40", overflow: "hidden",
          boxSizing: "border-box", opacity: Math.min(phoneIn.opacity, 1 - phoneOutP),
          transform: `${phoneIn.transform} translateX(${-340 * phoneOutP}px) scale(${phoneScale})` }}>
          <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>9:41</span>
            <span style={{ display: "flex", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: NAVY }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: NAVY }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d8d8d8" }} />
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px" }}>
            <span style={{ width: 38, height: 38, borderRadius: "50%", background: NAVY, color: "#8fc5d9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flex: "none" }}>★</span>
            <span>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 800 }}>norcalsbdc</span>
              <span style={{ display: "block", fontSize: 11, color: SLATE_L, fontWeight: 700 }}>NorCal SBDC · Training</span>
            </span>
          </div>
          <SqTile p={AI} w={386} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px 0" }}>
            <span style={{ fontSize: 24, lineHeight: 1, color: heart.opacity > 0.4 ? BERRY : NAVY, display: "inline-block",
              transform: `scale(${heart.opacity > 0 ? heart.scale : 1})` }}>{heart.opacity > 0.4 ? "♥" : "♡"}</span>
            <span style={{ fontSize: 13.5, fontWeight: 800 }}>{likes} likes</span>
            <span style={{ ...caps, fontSize: 10.5, color: SLATE_L, marginLeft: "auto" }}>Share</span>
          </div>
          <div style={{ padding: "10px 18px", fontSize: 13, lineHeight: 1.45, color: SLATE }}>
            <strong style={{ color: NAVY }}>norcalsbdc</strong> New for 2027: AI Essentials. Self-paced, practical, and it ends with a badge. Link in bio.
          </div>
        </div>
      </Shot>
      <Shot from={CUES.Email - 0.3} to={CUES.Register + 0.4}>
        <Window title="Inbox — training@norcalsbdc.org" x={340} y={100} w={1240} h={868}
          style={{ opacity: Math.min(mailIn.opacity, 1 - mailOutP),
            transform: `${mailIn.transform} translateX(${(1 - mailIn.opacity) * 320 - 300 * mailOutP}px)` }}>
          <div style={{ padding: "26px 40px 20px", borderBottom: "1px solid #0f1c2d1a" }}>
            <div style={{ fontSize: 27, fontWeight: 750, letterSpacing: "-.01em", ...MOTION.enter(T, CUES.Email + 0.5) }}>New: AI Essentials — earn the SBDC Certified badge.</div>
            <div style={{ fontSize: 13, color: SLATE_L, marginTop: 8, fontWeight: 700, ...MOTION.enter(T, CUES.Email + 0.7) }}>NorCal SBDC &lt;training@norcalsbdc.org&gt; · to Maria</div>
          </div>
          <div style={{ position: "relative", height: 668, overflow: "hidden" }}>
            <div style={{ width: 680, margin: "0 auto", transform: `translateY(${mailDrift}px)` }}>
              <div style={{ background: NAVY, color: PAPER, padding: "28px 34px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 }}>
                <img src={LOGO_WHITE} alt="" style={{ height: 30 }} />
                <span style={{ ...caps, fontSize: 11, color: GOLD.onNavy }}>New this month · AI Series</span>
              </div>
              <div style={{ marginTop: 26, ...MOTION.enter(T, CUES.Email + 0.9) }}>
                <Tile p={AI} w={680} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "13px 2px 0" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: SLATE }}>Online · Free · Register in 2 minutes</span>
                  <span style={{ ...caps, fontSize: 11, color: "#1b5faf", borderBottom: "1px solid #1b5faf55", paddingBottom: 2 }}>Save a seat →</span>
                </div>
              </div>
              <p style={{ margin: "26px 2px 0", fontSize: 14.5, lineHeight: 1.55, color: SLATE, ...MOTION.enter(T, CUES.Email + 1.2) }}>
                Eight short modules on putting AI to work in a small business. Finish all eight and you’re <strong style={{ color: NAVY }}>SBDC Certified</strong> — a standard our lender and grant partners recognize.
              </p>
            </div>
          </div>
        </Window>
      </Shot>
      <Shot from={CUES.Register - 0.3} to={CUES.Badge + 0.4}>
        <Window title="MySBDC — Your dashboard" x={340} y={110} w={1240} h={860}
          style={{ opacity: Math.min(dashIn.opacity, 1 - dashOutP),
            transform: `${dashIn.transform} translateX(${(1 - dashIn.opacity) * 320 - 300 * dashOutP}px)` }}>
          <div style={{ padding: "28px 48px 0" }}>
            <div style={{ fontSize: 29, fontWeight: 750, letterSpacing: "-.01em" }}>Good morning, Maria.</div>
            <div style={{ fontSize: 13, color: SLATE_L, fontWeight: 700, marginTop: 6 }}>Alvarez Ops Consulting · Advisor: J. Whitfield</div>
          </div>
          <div style={{ position: "absolute", left: 48, top: 170, width: 1144, height: 560, border: "1px solid #0f1c2d1f", background: PAPER }}>
            <div style={{ position: "absolute", left: 40, top: 60 }}><Tile p={AI} w={560} /></div>
            <div style={{ position: "absolute", left: 650, top: 60, width: 450 }}>
              <span style={{ ...caps, fontSize: 11, color: GOLD.ink }}>AI Series · Recommended by your advisor</span>
              <div style={{ fontFamily: SERA, fontSize: 42, letterSpacing: "-.03em", lineHeight: 1.02, marginTop: 18 }}>AI Essentials for Operators</div>
              <p style={{ margin: "20px 0 0", fontSize: 15, lineHeight: 1.55, color: SLATE }}>Eight self-paced modules. Finish them all and the SBDC Certified badge lands on your profile.</p>
              <div style={{ position: "absolute", left: 0, top: 300, width: 330, height: 58, display: "flex", alignItems: "center", justifyContent: "center",
                background: clicked ? EVGR : NAVY, color: PAPER, fontSize: 14, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase",
                transform: `scale(${press})` }}>
                {clicked ? "✓ You’re in — starts today" : "Register · One click"}
              </div>
              <div style={{ position: "absolute", left: 0, top: 372, fontSize: 12, fontWeight: 700, color: clicked ? EVGR : SLATE_L, opacity: clicked ? 1 : 0.85 }}>
                {clicked ? "Added to your plan · Advisor notified" : "Free · No forms — we already know you"}
              </div>
            </div>
          </div>
        </Window>
        <div style={{ position: "absolute", left: curX, top: curY, width: 88, height: 88, marginLeft: -44, marginTop: -44,
          borderRadius: "50%", border: "3px solid #1b5faf", opacity: rippleP > 0 && rippleP < 1 ? 0.55 * (1 - rippleP) : 0,
          transform: `scale(${0.35 + 1.8 * rippleP})`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: curX, top: curY, width: 26, height: 26, marginLeft: -6, marginTop: -6,
          borderRadius: "50%", background: PAPER, border: "2.5px solid #0f1c2d", boxShadow: "0 6px 18px #0f1c2d55",
          opacity: Math.min(MOTION.fade(T, CUES.Register + 1, 0.4), 1 - dashOutP), transform: `scale(${clicked && T < clickT + 0.25 ? 0.82 : 1})` }} />
      </Shot>
      <Shot from={CUES.Badge - 0.2} to={CUES.Milestone + 0.3}>
        <div style={{ position: "absolute", left: 960, top: 520, width: 760, marginLeft: -380,
          opacity: Math.min(cardIn.opacity, 1 - cardOutP), transform: `${cardIn.transform} translateY(-50%)` }}>
          <div style={{ position: "relative", background: PAPER, border: "1px solid #0f1c2d1f", boxShadow: "0 50px 120px #0f1c2d2e", padding: "44px 48px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <span style={{ width: 84, height: 84, borderRadius: "50%", background: NAVY, color: "#8fc5d9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 27, fontWeight: 800, flex: "none" }}>MA</span>
              <span>
                <span style={{ display: "block", fontSize: 29, fontWeight: 750, letterSpacing: "-.01em" }}>Maria Alvarez</span>
                <span style={{ display: "block", fontSize: 14, color: SLATE_L, fontWeight: 700, marginTop: 5 }}>Alvarez Ops Consulting · North Bay</span>
              </span>
            </div>
            <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid #0f1c2d14" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ ...caps, fontSize: 12, color: GOLD.ink }}>AI Essentials</span>
                <span style={{ fontSize: 13, fontWeight: 800 }}>8 of 8 modules</span>
              </div>
              <div style={{ height: 8, background: GOLD.tint, marginTop: 14 }}>
                <div style={{ height: 8, background: GOLD.c, width: `${100 * MOTION.fade(T, CUES.Badge + 0.4, 0.7)}%` }} />
              </div>
            </div>
            <div style={{ position: "absolute", top: -52, right: -48, opacity: seal.opacity, transform: `scale(${seal.scale}) rotate(${sealRot}deg)` }}>
              <Seal p={GOLD} size={160} />
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 40, ...MOTION.enter(T, CUES.Badge + 1.8) }}>
            <span style={{ ...caps, fontSize: 15, color: NAVY }}>Recognized by lender &amp; grant partners</span>
          </div>
        </div>
      </Shot>
      <Shot from={CUES.Milestone - 0.1} to={CUES.Close + 0.5}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center", opacity: mileOut, transform: `scale(${mileDrift})` }}>
          <div style={{ ...caps, fontSize: 21, color: BERRY, ...MOTION.enter(T, CUES.Milestone + 0.3) }}>Six months later</div>
          <div style={{ fontFamily: SERA, fontSize: 210, letterSpacing: "-.05em", lineHeight: 0.95, marginTop: 28,
            opacity: statPop.opacity, transform: `scale(${statPop.scale})` }}>$118K</div>
          <div style={{ fontSize: 24, lineHeight: 1.5, color: SLATE, maxWidth: 720, marginTop: 30, ...MOTION.enter(T, CUES.Milestone + 1.5) }}>
            New contract revenue Maria logged with her advisor — counted as economic impact.
          </div>
        </div>
      </Shot>
      {cap ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, textAlign: "center",
          opacity: Math.min(MOTION.fade(T, cap.at, 0.4), 1 - MOTION.fade(T, cap.until - 0.35, 0.35)) }}>
          <span style={{ ...caps, fontSize: 19, color: BERRY }}>{cap.text}</span>
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: closeBg, pointerEvents: "none",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ opacity: Math.min(MOTION.fade(T, CUES.Close + 0.25, 0.6), endFade), transform: `scale(${closeDrift})`,
          display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={LOGO_WHITE} alt="NorCal SBDC" style={{ height: 84, ...MOTION.enter(T, CUES.Close + 0.35) }} />
          <div style={{ fontFamily: SERA, fontSize: 92, letterSpacing: "-.04em", color: PAPER, marginTop: 48, ...MOTION.enter(T, CUES.Close + 0.6) }}>From scroll to outcome.</div>
          <div style={{ ...caps, fontSize: 20, color: "#8fc5d9", marginTop: 36, ...MOTION.enter(T, CUES.Close + 0.9) }}>Feed · Email · MySBDC · Certified · Impact</div>
        </div>
      </div>
    </div>
  );
}

function MarketingVideo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true });
  return (
    <div style={{ position: "fixed", inset: 0, background: "#e9e6df", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, boxSizing: "border-box" }}>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={CREAM}>
        <Piece />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Timeline" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak("motionEditor", v)} />
      </TweaksPanel>
    </div>
  );
}
window.MarketingVideo = MarketingVideo;
