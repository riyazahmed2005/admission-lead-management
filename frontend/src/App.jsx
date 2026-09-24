import { useEffect, useMemo, useState } from "react";

import {
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import FollowUps from "./pages/FollowUps";
import LeadDetails from "./pages/LeadDetails";
import Applications from "./pages/Applications";

const API_URL = "http://127.0.0.1:8000";

const emptyForm = {
  student_name: "",
  phone: "",
  email: "",
  city: "",
  qualification: "",
  course_id: "",
  source_id: "",
  counsellor_id: "",
  status: "New",
  priority: "Medium",
};

const statusOptions = [
  "New",
  "Contacted",
  "Interested",
  "Follow-up",
  "Qualified",
  "Application Started",
  "Application Submitted",
  "Converted",
  "Lost",
];

const priorityOptions = [
  "Low",
  "Medium",
  "High",
];

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/followups"
        element={<FollowUps />}
      />

      <Route
        path="/applications"
        element={<Applications />}
      />

      <Route
        path="/leads/:leadId"
        element={<LeadDetails />}
      />

      <Route
        path="*"
        element={<Dashboard />}
      />
    </Routes>
  );
}

function Dashboard() {
  const location = useLocation();

  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sources, setSources] = useState([]);
  const [counsellors, setCounsellors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");
  const [priorityFilter, setPriorityFilter] =
    useState("");
  const [counsellorFilter, setCounsellorFilter] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingLead, setEditingLead] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadMasterData();
    loadLeads();
    loadDashboardStats();
  }, []);

  const loadMasterData = async () => {
    try {
      const [
        coursesResponse,
        sourcesResponse,
        counsellorsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/master/courses`),
        fetch(`${API_URL}/master/sources`),
        fetch(`${API_URL}/master/counsellors`),
      ]);

      if (
        !coursesResponse.ok ||
        !sourcesResponse.ok ||
        !counsellorsResponse.ok
      ) {
        throw new Error(
          "Failed to load master data"
        );
      }

      const coursesData =
        await coursesResponse.json();

      const sourcesData =
        await sourcesResponse.json();

      const counsellorsData =
        await counsellorsResponse.json();

      setCourses(coursesData);
      setSources(sourcesData);
      setCounsellors(counsellorsData);
    } catch (error) {
      console.error(error);
      alert("Failed to load master data");
    }
  };

  const loadLeads = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/leads`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load leads"
        );
      }

      const data = await response.json();

      setLeads(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats =
    async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/stats`
        );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        setDashboardStats(data);
      } catch (error) {
        console.error(error);
      }
    };

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) => item.id === courseId
    );

    return course
      ? course.name
      : "-";
  };

  const getSourceName = (sourceId) => {
    const source = sources.find(
      (item) => item.id === sourceId
    );

    return source
      ? source.name
      : "-";
  };

  const getCounsellorName = (
    counsellorId
  ) => {
    const counsellor =
      counsellors.find(
        (item) =>
          item.id === counsellorId
      );

    return counsellor
      ? counsellor.name
      : "-";
  };

  const filteredLeads = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !searchText ||
        lead.student_name
          ?.toLowerCase()
          .includes(searchText) ||
        lead.phone
          ?.toLowerCase()
          .includes(searchText) ||
        lead.email
          ?.toLowerCase()
          .includes(searchText) ||
        lead.city
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        !statusFilter ||
        lead.status === statusFilter;

      const matchesPriority =
        !priorityFilter ||
        lead.priority === priorityFilter;

      const matchesCounsellor =
        !counsellorFilter ||
        String(lead.counsellor_id) ===
          String(counsellorFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCounsellor
      );
    });
  }, [
    leads,
    search,
    statusFilter,
    priorityFilter,
    counsellorFilter,
  ]);

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) =>
      lead.status === "New"
  ).length;

  const followups = leads.filter(
    (lead) =>
      lead.status === "Follow-up"
  ).length;

  const converted = leads.filter(
    (lead) =>
      lead.status === "Converted"
  ).length;

  const statusChartData =
    statusOptions.map((status) => ({
      name: status,
      value: leads.filter(
        (lead) =>
          lead.status === status
      ).length,
    }));

  const sourceChartData = sources.map(
    (source) => ({
      name: source.name,
      value: leads.filter(
        (lead) =>
          lead.source_id === source.id
      ).length,
    })
  );

  const priorityChartData =
    priorityOptions.map(
      (priority) => ({
        name: priority,
        value: leads.filter(
          (lead) =>
            lead.priority === priority
        ).length,
      })
    );

  const sourceColors = [
    "#0f172a",
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#9333ea",
    "#dc2626",
    "#0891b2",
  ];

  const openAddModal = () => {
    setEditingLead(null);

    setForm({
      ...emptyForm,
      course_id: courses[0]?.id
        ? String(courses[0].id)
        : "",
      source_id: sources[0]?.id
        ? String(sources[0].id)
        : "",
      counsellor_id:
        counsellors[0]?.id
          ? String(counsellors[0].id)
          : "",
    });

    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);

    setForm({
      student_name:
        lead.student_name || "",
      phone:
        lead.phone || "",
      email:
        lead.email || "",
      city:
        lead.city || "",
      qualification:
        lead.qualification || "",
      course_id: lead.course_id
        ? String(lead.course_id)
        : "",
      source_id: lead.source_id
        ? String(lead.source_id)
        : "",
      counsellor_id:
        lead.counsellor_id
          ? String(lead.counsellor_id)
          : "",
      status:
        lead.status || "New",
      priority:
        lead.priority || "Medium",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLead(null);
    setForm(emptyForm);
  };

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentName =
      form.student_name.trim();

    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!studentName) {
      alert("Please enter student name.");
      return;
    }

    if (!phone) {
      alert("Please enter phone number.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      alert(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      email &&
      !emailRegex.test(email)
    ) {
      alert(
        "Please enter a valid email address."
      );
      return;
    }

    if (!form.course_id) {
      alert("Please select a course.");
      return;
    }

    if (!form.source_id) {
      alert("Please select a source.");
      return;
    }

    if (!form.counsellor_id) {
      alert("Please select a counsellor.");
      return;
    }

    const payload = {
      student_name: studentName,
      phone: phone,
      email: email || null,
      city:
        form.city.trim() || null,
      qualification:
        form.qualification.trim() ||
        null,
      course_id: Number(
        form.course_id
      ),
      source_id: Number(
        form.source_id
      ),
      counsellor_id: Number(
        form.counsellor_id
      ),
      status: form.status,
      priority: form.priority,
    };

    try {
      let response;

      if (editingLead) {
        response = await fetch(
          `${API_URL}/leads/${editingLead.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              payload
            ),
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/leads`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to save lead"
        );
      }

      closeModal();

      await loadLeads();
      await loadDashboardStats();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Failed to save lead"
      );
    }
  };

  const updateLeadStatus = async (
    lead,
    newStatus
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/leads/${lead.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update lead status"
        );
      }

      await loadLeads();
      await loadDashboardStats();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update lead status."
      );

      await loadLeads();
    }
  };

  const deleteLead = async (lead) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${lead.student_name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/leads/${lead.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete lead"
        );
      }

      await loadLeads();
      await loadDashboardStats();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Failed to delete lead"
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCounsellorFilter("");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

        <div className="flex h-full flex-col">

          <div className="border-b border-slate-200 px-6 py-6">

            <h1 className="text-lg font-bold text-slate-900">
              Admission CRM
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Lead Management System
            </p>

          </div>

          <nav className="flex-1 p-4">

            <Link
              to="/"
              className={`mb-2 flex rounded-lg px-4 py-3 text-sm font-medium ${
                location.pathname === "/"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Leads
            </Link>

            <Link
              to="/followups"
              className={`mb-2 flex rounded-lg px-4 py-3 text-sm font-medium ${
                location.pathname ===
                "/followups"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Follow-ups
            </Link>

            <Link
              to="/applications"
              className={`flex rounded-lg px-4 py-3 text-sm font-medium ${
                location.pathname ===
                "/applications"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Applications
            </Link>

          </nav>

          <div className="border-t border-slate-200 p-4">

            <p className="text-xs text-slate-400">
              Admission Lead Management
            </p>

            <p className="mt-1 text-xs text-slate-500">
              v1.0
            </p>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="lg:ml-64">

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Dashboard
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Admission Leads
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage and track student admission enquiries.
              </p>

            </div>

            <button
              onClick={
                openAddModal
              }
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              + Add Lead
            </button>

          </div>

          {/* KPI CARDS */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <KpiCard
              title="Total Leads"
              value={totalLeads}
            />

            <KpiCard
              title="New Leads"
              value={newLeads}
            />

            <KpiCard
              title="Follow-ups"
              value={followups}
            />

            <KpiCard
              title="Converted"
              value={converted}
            />

            <KpiCard
              title="Conversion Rate"
              value={
                dashboardStats
                  ? `${dashboardStats.conversion_rate}%`
                  : "0%"
              }
            />

          </div>

          {/* ANALYTICS */}
          <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold text-slate-900">
                Lead Status Distribution
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Current leads by admission stage.
              </p>

              <div className="mt-4 h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      statusChartData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      tick={{
                        fontSize: 10,
                      }}
                    />

                    <YAxis
                      allowDecimals={
                        false
                      }
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      name="Leads"
                      fill="#0f172a"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold text-slate-900">
                Leads by Source
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Admission enquiry sources.
              </p>

              <div className="mt-4 h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={
                        sourceChartData
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={105}
                      label
                    >

                      {sourceChartData.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={
                              `cell-${index}`
                            }
                            fill={
                              sourceColors[
                                index %
                                  sourceColors.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />
                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <h3 className="text-lg font-semibold text-slate-900">
                Lead Priority
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Distribution by priority.
              </p>

              <div className="mt-4 h-72">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      priorityChartData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis
                      allowDecimals={
                        false
                      }
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      name="Leads"
                      fill="#2563eb"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

          {/* FILTERS */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">

              <div>

                <h3 className="font-semibold text-slate-900">
                  Lead Management
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Search and filter admission leads.
                </p>

              </div>

              <button
                onClick={
                  clearFilters
                }
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Clear Filters
              </button>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

              <input
                type="text"
                placeholder="Search name, phone, email, city..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >

                <option value="">
                  All Statuses
                </option>

                {statusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}

              </select>

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >

                <option value="">
                  All Priorities
                </option>

                {priorityOptions.map(
                  (priority) => (
                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>
                  )
                )}

              </select>

              <select
                value={counsellorFilter}
                onChange={(event) =>
                  setCounsellorFilter(
                    event.target.value
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >

                <option value="">
                  All Counsellors
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

          </div>

          {/* LEADS TABLE */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="min-w-[1150px] w-full">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      City
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Course
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Source
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Counsellor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading ? (
                    <tr>

                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        Loading leads...
                      </td>

                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>

                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No leads found.
                      </td>

                    </tr>
                  ) : (
                    filteredLeads.map(
                      (lead) => (
                        <tr
                          key={lead.id}
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <p className="text-sm font-semibold text-slate-900">
                              {
                                lead.student_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                lead.phone
                              }
                            </p>

                            {lead.email && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  lead.email
                                }
                              </p>
                            )}

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {
                              lead.city ||
                              "-"
                            }
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {
                              getCourseName(
                                lead.course_id
                              )
                            }
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {
                              getSourceName(
                                lead.source_id
                              )
                            }
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {
                              getCounsellorName(
                                lead.counsellor_id
                              )
                            }
                          </td>

                          <td className="px-6 py-4">

                            <select
                              value={
                                lead.status ||
                                "New"
                              }
                              onChange={(
                                event
                              ) =>
                                updateLeadStatus(
                                  lead,
                                  event.target
                                    .value
                                )
                              }
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-slate-500"
                            >

                              {statusOptions.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}

                            </select>

                          </td>

                          <td className="px-6 py-4">

                            <PriorityBadge
                              priority={
                                lead.priority
                              }
                            />

                          </td>

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3 whitespace-nowrap">

                              <Link
                                to={`/leads/${lead.id}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                View
                              </Link>

                              <button
                                onClick={() =>
                                  openEditModal(
                                    lead
                                  )
                                }
                                className="text-sm font-medium text-slate-600 hover:text-slate-900"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  deleteLead(
                                    lead
                                  )
                                }
                                className="text-sm font-medium text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="border-t border-slate-200 px-6 py-4">

              <p className="text-xs text-slate-500">
                Showing{" "}
                {filteredLeads.length}{" "}
                of{" "}
                {leads.length}{" "}
                leads
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingLead
                    ? "Edit Lead"
                    : "Add New Lead"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter student admission enquiry details.
                </p>

              </div>

              <button
                onClick={closeModal}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <FormField label="Student Name *">
                  <input
                    name="student_name"
                    value={
                      form.student_name
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Enter student name"
                    className="input"
                    required
                  />
                </FormField>

                <FormField label="Phone *">
                  <input
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    className="input"
                    required
                  />
                </FormField>

                <FormField label="Email">
                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Enter email"
                    className="input"
                  />
                </FormField>

                <FormField label="City">
                  <input
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Enter city"
                    className="input"
                  />
                </FormField>

                <FormField label="Qualification">
                  <input
                    name="qualification"
                    value={
                      form.qualification
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="e.g. 12th, B.E., B.Com"
                    className="input"
                  />
                </FormField>

                <FormField label="Course *">
                  <select
                    name="course_id"
                    value={
                      form.course_id
                    }
                    onChange={
                      handleFormChange
                    }
                    className="input"
                    required
                  >

                    <option value="">
                      Select course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {
                            course.name
                          }
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField label="Source *">
                  <select
                    name="source_id"
                    value={
                      form.source_id
                    }
                    onChange={
                      handleFormChange
                    }
                    className="input"
                    required
                  >

                    <option value="">
                      Select source
                    </option>

                    {sources.map(
                      (source) => (
                        <option
                          key={source.id}
                          value={source.id}
                        >
                          {
                            source.name
                          }
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField label="Counsellor *">
                  <select
                    name="counsellor_id"
                    value={
                      form.counsellor_id
                    }
                    onChange={
                      handleFormChange
                    }
                    className="input"
                    required
                  >

                    <option value="">
                      Select counsellor
                    </option>

                    {counsellors.map(
                      (
                        counsellor
                      ) => (
                        <option
                          key={
                            counsellor.id
                          }
                          value={
                            counsellor.id
                          }
                        >
                          {
                            counsellor.name
                          }
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleFormChange
                    }
                    className="input"
                  >

                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField label="Priority">
                  <select
                    name="priority"
                    value={
                      form.priority
                    }
                    onChange={
                      handleFormChange
                    }
                    className="input"
                  >

                    {priorityOptions.map(
                      (priority) => (
                        <option
                          key={priority}
                          value={priority}
                        >
                          {priority}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {editingLead
                    ? "Update Lead"
                    : "Create Lead"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

function KpiCard({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PriorityBadge({
  priority,
}) {
  const styles = {
    Low:
      "bg-slate-100 text-slate-600",
    Medium:
      "bg-yellow-50 text-yellow-700",
    High:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[priority] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {priority || "-"}
    </span>
  );
}

function FormField({
  label,
  children,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

export default App;