/* Training series promo — built on animations-v3 CompositionStage */
const { CompositionStage, useComposition, Shot, Easing, animate, clamp,
        useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;

const SERA = "'proxima-sera',Georgia,serif";
const NOVA = "'proxima-nova',Arial,Helvetica,sans-serif";
const LOGO_WHITE = "https://www.norcalsbdc.org/wp-content/themes/norcal-sbdc/assets/img/logos/americas-sbdc-norcal-white-180h.png";
const NAVY = "#0f1c2d", CREAM = "#f5f1e8", BERRY = "#c23c3c";

const TRACKS = {
  pool:      { c: "#8fc5d9", onNavy: "#8fc5d9", ink: "#35708c" },
  cobalt:    { c: "#1b5faf", onNavy: "#7fb0e8", ink: "#1b5faf" },
  evergreen: { c: "#00675c", onNavy: "#5cb3a6", ink: "#00675c" },
  gold:      { c: "#c0953f", onNavy: "#d9b56a", ink: "#8f6c24" }
};
const PROGRAMS = [
  { series: "Startup Series", title: "Vision to Business in Six Weeks", meta: "Live cohort · 6 sessions", ...TRACKS.pool },
  { series: "Growth Series", title: "ProBiz Fundamentals", meta: "Live cohort · 6 weeks", ...TRACKS.cobalt },
  { series: "SBDC Health", title: "Run a Healthier Practice", meta: "Hybrid · With AWS", ...TRACKS.evergreen },
  { series: "AI Series", title: "AI Essentials for Operators", meta: "Self-paced · Certification", ...TRACKS.gold },
  { series: "Growth Series", title: "Capital Ready", meta: "Live cohort · 8 weeks", ...TRACKS.cobalt },
  { series: "Startup Series", title: "E-commerce Foundations", meta: "Webinar series", ...TRACKS.pool },
  { series: "Industry Series", title: "Made for Manufacturing", meta: "In-person workshops", ...TRACKS.evergreen },
  { series: "Growth Series", title: "Digital Marketing Sprint", meta: "Live cohort · 4 weeks", ...TRACKS.cobalt }
];
const HERO = PROGRAMS[4];

/* --- the only three motion helpers --- */
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
    <div style={{ width: w, height: h, background: NAVY, color: "#fdfdfd", position: "relative",
      overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: `${18 * s}px ${24 * s}px ${18 * s}px ${32 * s}px`, boxSizing: "border-box",
      boxShadow: "0 30px 70px #0f1c2d30", flex: "none" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 9 * s, background: p.c }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <img src={LOGO_WHITE} alt="" style={{ height: 26 * s, display: "block" }} />
        <span style={{ fontSize: 12 * s, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase",
          color: p.onNavy, marginTop: 4 * s, fontFamily: NOVA }}>{p.series}</span>
      </div>
      <div>
        <div style={{ fontFamily: SERA, fontSize: 33 * s, letterSpacing: "-.03em", lineHeight: 1.05, textWrap: "balance" }}>{p.title}</div>
        <div style={{ marginTop: 10 * s, fontSize: 13 * s, fontWeight: 700, color: "#ffffff99", fontFamily: NOVA }}>{p.meta} · Free</div>
      </div>
    </div>
  );
}

function Seal({ p, size = 150 }) {
  const s = size / 150;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `${3 * s}px solid ${p.c}`,
      background: "#fdfdfd", boxShadow: `0 0 0 ${10 * s}px #fdfdfd55, 0 24px 50px #0f1c2d40`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 * s }}>
      <span style={{ fontSize: 30 * s, lineHeight: 1, color: p.ink }}>★</span>
      <span style={{ fontSize: 13 * s, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: NAVY, fontFamily: NOVA }}>SBDC</span>
      <span style={{ fontSize: 13 * s, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: p.ink, fontFamily: NOVA }}>Certified</span>
    </div>
  );
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  const endFade = 1 - MOTION.fade(T, authoredTotal - 0.6, 0.6);

  /* Opening */
  const openOut = 1 - MOTION.fade(T, CUES.Tracks - 0.3, 0.5);
  const openDrift = 1 + 0.02 * clamp(T / (CUES.Tracks || 3.5), 0, 1);

  /* Tracks */
  const trackList = [
    { name: "Startup Series", line: "Start here", ...TRACKS.pool },
    { name: "Growth Series", line: "Scale what works", ...TRACKS.cobalt },
    { name: "Industry Series", line: "Built for your field", ...TRACKS.evergreen },
    { name: "AI & Certifications", line: "New for 2027", ...TRACKS.gold }
  ];
  const tracksOut = 1 - MOTION.fade(T, CUES.Series - 0.35, 0.5);
  const tracksShift = -70 * MOTION.fade(T, CUES.Series - 0.35, 0.5);

  /* Rail: pitch 480 + 30 gap; hero index 4 lands at center */
  const PITCH = 510;
  const railX = animate({ from: 1640, to: 960 - (4 * PITCH + 240), start: CUES.Series - 0.35, end: CUES.Focus + 0.8, ease: Easing.easeInOutSine })(T);
  const railOut = 1 - MOTION.fade(T, CUES.Focus + 0.8, 0.7);

  /* Hero: grows out of the rail card (880 * .545 = 480) */
  const heroIn = MOTION.fade(T, CUES.Focus + 0.8, 0.5);
  const heroGrow = animate({ from: 0.5455, to: 1, start: CUES.Focus + 0.8, end: CUES.Focus + 2, ease: Easing.easeInOutCubic })(T);
  const heroZoom = 1 + 0.03 * clamp((T - (CUES.Focus + 2)) / ((CUES.Close - CUES.Focus - 2) || 1), 0, 1);
  const heroOut = 1 - MOTION.fade(T, CUES.Close, 0.5);
  const seal = MOTION.pop(T, CUES.Certified + 0.3, 0.7);
  const sealRot = -14 * (1 - clamp((T - (CUES.Certified + 0.3)) / 0.7, 0, 1));

  /* Close */
  const closeIn = MOTION.fade(T, CUES.Close + 0.15, 0.7);
  const closeDrift = 1 + 0.02 * clamp((T - CUES.Close) / ((authoredTotal - CUES.Close) || 3.5), 0, 1);

  const caps = { fontSize: 22, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", fontFamily: NOVA };

  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, overflow: "hidden", fontFamily: NOVA, color: NAVY }}>
      <Shot from={0} to={CUES.Tracks + 0.4}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center", opacity: openOut, transform: `scale(${openDrift})` }}>
          <div style={{ ...caps, color: BERRY, ...MOTION.enter(T, 0.3) }}>NorCal SBDC · Training 2027</div>
          <div style={{ fontFamily: SERA, fontSize: 128, letterSpacing: "-.05em", lineHeight: 0.98, marginTop: 38, ...MOTION.enter(T, 0.65, 0.8) }}>One system.</div>
          <div style={{ fontFamily: SERA, fontSize: 128, letterSpacing: "-.05em", lineHeight: 0.98, marginTop: 8, ...MOTION.enter(T, 0.95, 0.8) }}>Every stage.</div>
        </div>
      </Shot>
      <Shot from={CUES.Tracks - 0.2} to={CUES.Series + 0.4}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          gap: 84, opacity: tracksOut, transform: `translateX(${tracksShift}px)` }}>
          {trackList.map((t, i) => {
            const pop = MOTION.pop(T, CUES.Tracks + 0.25 + i * 0.28, 0.65);
            return (
              <div key={t.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26,
                opacity: pop.opacity, transform: `scale(${pop.scale})`, width: 300, textAlign: "center" }}>
                <span style={{ width: 84, height: 84, background: t.c }} />
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase" }}>{t.name}</span>
                <span style={{ fontFamily: SERA, fontSize: 30, letterSpacing: "-.02em", color: "#2c3240", marginTop: -8 }}>{t.line}</span>
              </div>
            );
          })}
        </div>
      </Shot>
      <Shot from={CUES.Series - 0.45} to={CUES.Focus + 1.8}>
        <div style={{ position: "absolute", top: 405, left: 0, display: "flex", gap: 30, opacity: railOut,
          transform: `translateX(${railX}px)` }}>
          {PROGRAMS.map((p, i) => <Tile key={i} p={p} />)}
        </div>
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center",
          opacity: Math.min(MOTION.fade(T, CUES.Series + 0.1, 0.5), railOut) }}>
          <span style={{ ...caps, color: BERRY }}>The 2027 lineup</span>
        </div>
      </Shot>
      <Shot from={CUES.Focus + 0.7} to={CUES.Close + 0.6}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 880, height: 495, opacity: Math.min(heroIn, heroOut),
          transform: `translate(-50%,-50%) scale(${heroGrow * heroZoom})` }}>
          <div style={{ position: "relative", width: 880, height: 495 }}>
            <Tile p={HERO} w={880} />
            <div style={{ position: "absolute", top: -46, right: -46, opacity: seal.opacity,
              transform: `scale(${seal.scale}) rotate(${sealRot}deg)` }}>
              <Seal p={HERO} />
            </div>
          </div>
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, textAlign: "center", paddingTop: 54, ...MOTION.enter(T, CUES.Certified + 1.1) }}>
            <span style={{ fontFamily: SERA, fontSize: 40, letterSpacing: "-.02em", color: NAVY }}>Partners recognize it. Clients earn it.</span>
          </div>
        </div>
      </Shot>
      <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: Math.min(MOTION.fade(T, CUES.Close, 0.7), endFade),
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
        pointerEvents: "none" }}>
        <div style={{ opacity: Math.min(closeIn, endFade), transform: `scale(${closeDrift})`,
          display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={LOGO_WHITE} alt="NorCal SBDC" style={{ height: 84, ...MOTION.enter(T, CUES.Close + 0.4) }} />
          <div style={{ fontFamily: SERA, fontSize: 92, letterSpacing: "-.04em", color: "#fdfdfd", marginTop: 48, ...MOTION.enter(T, CUES.Close + 0.7) }}>Training, rebranded.</div>
          <div style={{ ...caps, fontSize: 20, color: "#8fc5d9", marginTop: 36, ...MOTION.enter(T, CUES.Close + 1) }}>Coming 2027 · MySBDC</div>
        </div>
      </div>
    </div>
  );
}

function ThumbnailVideo() {
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
window.ThumbnailVideo = ThumbnailVideo;
