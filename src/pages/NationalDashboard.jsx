// src/pages/NationalDashboard.jsx
import React, { useEffect, useState } from "react";
import { KPIGrid, Section, LoadingCard, ErrorCard } from "../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

export default function NationalDashboard() {
  const [national, setNational] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/aggregate/national`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNational(data);
      } catch (e) {
        setError("Failed to load national data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const computeServiceLoad = (d) => {
    if (!d) return 0;
    const e = d.enrolment || {};
    const b = d.biometric_update || {};
    const dm = d.demographic_update || {};
    return (
      1.2 * (e.age_0_5 || 0) +
      1.1 * (e.age_5_17 || 0) +
      1.0 * (e.age_18_greater || 0) +
      0.8 * (b.bio_age_5_17 || 0) +
      1.0 * (b.bio_age_17_ || 0) +
      0.6 * (dm.demo_age_5_17 || 0) +
      0.7 * (dm.demo_age_17_ || 0)
    );
  };

  if (loading) return <LoadingCard />;
  if (error || !national) return <ErrorCard error={error} />;

  const nationalLoad = Math.round(computeServiceLoad(national));
  const totalEnrol = (national.enrolment?.age_0_5 || 0) + (national.enrolment?.age_5_17 || 0) + (national.enrolment?.age_18_greater || 0);
  const totalUpdates = (national.biometric_update?.bio_age_5_17 || 0) + (national.biometric_update?.bio_age_17_ || 0) + (national.demographic_update?.demo_age_5_17 || 0) + (national.demographic_update?.demo_age_17_ || 0);

  return (
    <>
      <KPIGrid items={[
        ["Service Load (Observed)", nationalLoad],
        ["Total Enrolments", totalEnrol],
        ["Total Updates", totalUpdates]
      ]} />
      <Section title="National Summary">
        Computed using official Aadhaar Pulse service weighting model.
      </Section>
    </>
  );
}
