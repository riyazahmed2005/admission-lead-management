import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function LeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    followup_date: "",
    mode: "Phone",
    outcome: "",
    remarks: "",
    next_followup_date: "",
  });

  useEffect(() => {
    loadData();
  }, [leadId]);

  const loadData = async () => {
    try {
      const [leadResponse, followupResponse] = await Promise.all([
        fetch(`${API_URL}/leads/${leadId}`),
        fetch(`${API_URL}/followups?lead_id=${leadId}`),
      ]);

      if (!leadResponse.ok) {
        throw new Error("Lead not found");
      }

      const leadData = await leadResponse.json();
      const followupData = await followupResponse.json();

      setLead(leadData);
      setFollowups(followupData);
    } catch (error) {
      console.error(error);
      alert("Unable to load lead details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addFollowup = async (e) => {
    e.preventDefault();

    if (!form.followup_date) {
      alert("Please select follow-up date");
      return;
    }

    try {
      const payload = {
        lead_id: Number(leadId),
        counsellor_id: lead.counsellor_id,
        followup_date: form.followup_date,
        mode: form.mode,
        outcome: form.outcome || null,
        remarks: form.remarks || null,
        next_followup_date:
          form.next_followup_date || null,
      };

      const response = await fetch(`${API_URL}/followups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create follow-up");
      }

      setForm({
        followup_date: "",
        mode: "Phone",
        outcome: "",
        remarks: "",
        next_followup_date: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to add follow-up");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-600">
        Loading lead details...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8">
        <p className="text-red-600">Lead not found.</p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/")}
            className="mb-2 text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to Leads
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            {lead.student_name}
          </h1>

          <p className="text-sm text-slate-500">
            Lead #{lead.id}
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add Follow-up
        </button>
      </div>

      {/* Lead Information */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          title="Phone"
          value={lead.phone || "-"}
        />

        <InfoCard
          title="Email"
          value={lead.email || "-"}
        />

        <InfoCard
          title="City"
          value={lead.city || "-"}
        />

        <InfoCard
          title="Qualification"
          value={lead.qualification || "-"}
        />
      </div>

      {/* Status */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Lead Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            label="Status"
            value={lead.status}
          />

          <InfoItem
            label="Priority"
            value={lead.priority}
          />

          <InfoItem
            label="Course ID"
            value={lead.course_id}
          />

          <InfoItem
            label="Counsellor ID"
            value={lead.counsellor_id}
          />
        </div>
      </div>

      {/* Follow-up History */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Follow-up History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track communication and next actions for this lead.
          </p>
        </div>

        {followups.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No follow-ups recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {followups.map((followup) => (
              <div
                key={followup.id}
                className="p-6 hover:bg-slate-50"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-900">
                        {followup.mode || "Contact"}
                      </span>

                      {followup.outcome && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {followup.outcome}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {followup.remarks || "No remarks"}
                    </p>
                  </div>

                  <div className="text-sm md:text-right">
                    <p className="font-medium text-slate-700">
                      {formatDate(followup.followup_date)}
                    </p>

                    {followup.next_followup_date && (
                      <p className="mt-1 text-xs text-slate-500">
                        Next:{" "}
                        {formatDate(followup.next_followup_date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Follow-up Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Add Follow-up
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={addFollowup}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Follow-up Date
                </label>

                <input
                  type="datetime-local"
                  name="followup_date"
                  value={form.followup_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Mode
                </label>

                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option>Phone</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Walk-in</option>
                  <option>Video Call</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Outcome
                </label>

                <select
                  name="outcome"
                  value={form.outcome}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="">Select outcome</option>
                  <option>Interested</option>
                  <option>Not Interested</option>
                  <option>Requested Information</option>
                  <option>Call Back</option>
                  <option>Application Started</option>
                  <option>Application Submitted</option>
                  <option>Converted</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter follow-up remarks..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Next Follow-up
                </label>

                <input
                  type="datetime-local"
                  name="next_followup_date"
                  value={form.next_followup_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
                >
                  Save Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 truncate text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default LeadDetails;