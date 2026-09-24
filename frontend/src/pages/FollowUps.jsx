import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Phone,
  MessageSquare,
  Users,
  Calendar,
  Trash2,
} from "lucide-react";

import api from "../services/api";

function FollowUps() {
  const [followups, setFollowups] = useState([]);
  const [leads, setLeads] = useState([]);
  const [counsellors, setCounsellors] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    lead_id: "",
    counsellor_id: "",
    followup_date: "",
    mode: "Phone",
    outcome: "Interested",
    remarks: "",
    next_followup_date: "",
  });

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      const [
        followupResponse,
        leadsResponse,
        counsellorResponse,
      ] = await Promise.all([
        api.get("/followups"),
        api.get("/leads"),
        api.get("/master/counsellors"),
      ]);

      setFollowups(followupResponse.data);
      setLeads(leadsResponse.data);
      setCounsellors(counsellorResponse.data);
    } catch (error) {
      console.error(
        "Failed to load follow-up data:",
        error
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // GET LEAD NAME
  // =========================

  const getLeadName = (id) => {
    const lead = leads.find(
      (item) => item.id === id
    );

    return lead
      ? lead.student_name
      : `Lead #${id}`;
  };

  // =========================
  // GET COUNSELLOR NAME
  // =========================

  const getCounsellorName = (id) => {
    const counsellor = counsellors.find(
      (item) => item.id === id
    );

    return counsellor
      ? counsellor.name
      : id
        ? `Counsellor #${id}`
        : "Unassigned";
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE FOLLOW-UP
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/followups", {
        lead_id: Number(form.lead_id),

        counsellor_id: form.counsellor_id
          ? Number(form.counsellor_id)
          : null,

        followup_date: form.followup_date,

        mode: form.mode,

        outcome: form.outcome,

        remarks: form.remarks || null,

        next_followup_date:
          form.next_followup_date || null,
      });

      setShowModal(false);

      setForm({
        lead_id: "",
        counsellor_id: "",
        followup_date: "",
        mode: "Phone",
        outcome: "Interested",
        remarks: "",
        next_followup_date: "",
      });

      await loadData();

    } catch (error) {
      console.error(
        "Failed to create follow-up:",
        error
      );

      alert("Failed to create follow-up.");
    }
  };

  // =========================
  // DELETE FOLLOW-UP
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this follow-up?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/followups/${id}`);

      await loadData();

    } catch (error) {
      console.error(
        "Failed to delete follow-up:",
        error
      );

      alert("Failed to delete follow-up.");
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredFollowups =
    followups.filter((item) =>
      getLeadName(item.lead_id)
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // =========================
  // MODE ICON
  // =========================

  const getModeIcon = (mode) => {
    if (mode === "Phone") {
      return <Phone size={16} />;
    }

    if (mode === "WhatsApp") {
      return <MessageSquare size={16} />;
    }

    return <Users size={16} />;
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Follow-up Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track student follow-ups and next actions
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />

            Add Follow-up
          </button>

        </div>


        {/* SEARCH */}

        <div className="mb-6 rounded-xl border bg-white p-4">

          <div className="relative max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-hidden rounded-xl border bg-white">

          <div className="border-b px-6 py-4">

            <h2 className="font-semibold text-slate-900">
              Follow-ups
            </h2>

            <p className="text-xs text-slate-500">
              {filteredFollowups.length} follow-ups found
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                <tr>

                  <th className="px-6 py-4">
                    Student
                  </th>

                  <th className="px-6 py-4">
                    Counsellor
                  </th>

                  <th className="px-6 py-4">
                    Follow-up Date
                  </th>

                  <th className="px-6 py-4">
                    Mode
                  </th>

                  <th className="px-6 py-4">
                    Outcome
                  </th>

                  <th className="px-6 py-4">
                    Next Follow-up
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredFollowups.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="hover:bg-slate-50"
                    >

                      {/* STUDENT */}

                      <td className="px-6 py-4">

                        <div className="font-semibold text-slate-900">

                          {getLeadName(
                            item.lead_id
                          )}

                        </div>

                      </td>


                      {/* COUNSELLOR */}

                      <td className="px-6 py-4 text-sm text-slate-600">

                        {getCounsellorName(
                          item.counsellor_id
                        )}

                      </td>


                      {/* FOLLOW-UP DATE */}

                      <td className="px-6 py-4 text-sm text-slate-600">

                        <div className="flex items-center gap-2">

                          <Calendar size={15} />

                          {new Date(
                            item.followup_date
                          ).toLocaleString()}

                        </div>

                      </td>


                      {/* MODE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-700">

                          {getModeIcon(
                            item.mode
                          )}

                          {item.mode || "-"}

                        </div>

                      </td>


                      {/* OUTCOME */}

                      <td className="px-6 py-4">

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                          {item.outcome || "-"}

                        </span>

                      </td>


                      {/* NEXT FOLLOW-UP */}

                      <td className="px-6 py-4 text-sm text-slate-600">

                        {item.next_followup_date
                          ? new Date(
                              item.next_followup_date
                            ).toLocaleString()
                          : "-"}

                      </td>


                      {/* DELETE */}

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete Follow-up"
                        >

                          <Trash2 size={17} />

                        </button>

                      </td>

                    </tr>

                  )
                )}


                {/* EMPTY */}

                {filteredFollowups.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >

                      No follow-ups found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* ADD FOLLOW-UP MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="border-b px-6 py-5">

              <h2 className="text-xl font-bold text-slate-900">
                Add Follow-up
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record a student follow-up
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >

              {/* STUDENT */}

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Student *
                </label>

                <select
                  required
                  name="lead_id"
                  value={form.lead_id}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                >

                  <option value="">
                    Select Student
                  </option>

                  {leads.map((lead) => (

                    <option
                      key={lead.id}
                      value={lead.id}
                    >
                      {lead.student_name}
                    </option>

                  ))}

                </select>

              </div>


              {/* COUNSELLOR */}

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Counsellor
                </label>

                <select
                  name="counsellor_id"
                  value={form.counsellor_id}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                >

                  <option value="">
                    Select Counsellor
                  </option>

                  {counsellors.map(
                    (counsellor) => (

                      <option
                        key={counsellor.id}
                        value={counsellor.id}
                      >
                        {counsellor.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* DATES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Follow-up Date *
                  </label>

                  <input
                    required
                    type="datetime-local"
                    name="followup_date"
                    value={form.followup_date}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                  />

                </div>


                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Next Follow-up
                  </label>

                  <input
                    type="datetime-local"
                    name="next_followup_date"
                    value={
                      form.next_followup_date
                    }
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                  />

                </div>

              </div>


              {/* MODE + OUTCOME */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Mode
                  </label>

                  <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                  >

                    <option value="Phone">
                      Phone
                    </option>

                    <option value="WhatsApp">
                      WhatsApp
                    </option>

                    <option value="Email">
                      Email
                    </option>

                    <option value="Walk-in">
                      Walk-in
                    </option>

                    <option value="Meeting">
                      Meeting
                    </option>

                  </select>

                </div>


                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Outcome
                  </label>

                  <select
                    name="outcome"
                    value={form.outcome}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                  >

                    <option value="Interested">
                      Interested
                    </option>

                    <option value="Not Interested">
                      Not Interested
                    </option>

                    <option value="Call Back">
                      Call Back
                    </option>

                    <option value="Requested Information">
                      Requested Information
                    </option>

                    <option value="Application Started">
                      Application Started
                    </option>

                    <option value="Converted">
                      Converted
                    </option>

                    <option value="Lost">
                      Lost
                    </option>

                  </select>

                </div>

              </div>


              {/* REMARKS */}

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  rows="3"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Enter follow-up remarks..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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

export default FollowUps;