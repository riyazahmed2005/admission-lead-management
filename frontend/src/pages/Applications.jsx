import {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL = "http://127.0.0.1:8000";

const applicationStatuses = [
  "Not Started",
  "In Progress",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

const paymentStatuses = [
  "Pending",
  "Partial",
  "Paid",
];

const emptyForm = {
  lead_id: "",
  application_number: "",
  application_date: "",
  status: "Not Started",
  fee_amount: "0",
  payment_status: "Pending",
  remarks: "",
};

function Applications() {
  const [applications, setApplications] =
    useState([]);

  const [leads, setLeads] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [paymentFilter, setPaymentFilter] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingApplication,
    setEditingApplication,
  ] = useState(null);

  const [form, setForm] =
    useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        applicationsResponse,
        leadsResponse,
        coursesResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/applications`),
        fetch(`${API_URL}/leads`),
        fetch(`${API_URL}/master/courses`),
      ]);

      if (
        !applicationsResponse.ok ||
        !leadsResponse.ok ||
        !coursesResponse.ok
      ) {
        throw new Error(
          "Failed to load application data"
        );
      }

      const applicationsData =
        await applicationsResponse.json();

      const leadsData =
        await leadsResponse.json();

      const coursesData =
        await coursesResponse.json();

      setApplications(
        applicationsData
      );

      setLeads(leadsData);
      setCourses(coursesData);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load application data."
      );
    } finally {
      setLoading(false);
    }
  };

  const getLead = (leadId) => {
    return leads.find(
      (lead) => lead.id === leadId
    );
  };

  const getStudentName = (leadId) => {
    const lead = getLead(leadId);

    return lead
      ? lead.student_name
      : "-";
  };

  const getCourseName = (leadId) => {
    const lead = getLead(leadId);

    if (!lead) {
      return "-";
    }

    const course = courses.find(
      (item) =>
        item.id === lead.course_id
    );

    return course
      ? course.name
      : "-";
  };

  const filteredApplications =
    useMemo(() => {
      const searchText = search
        .trim()
        .toLowerCase();

      return applications.filter(
        (application) => {
          const studentName =
            getStudentName(
              application.lead_id
            ).toLowerCase();

          const applicationNumber =
            (
              application.application_number ||
              ""
            ).toLowerCase();

          const matchesSearch =
            !searchText ||
            studentName.includes(
              searchText
            ) ||
            applicationNumber.includes(
              searchText
            );

          const matchesStatus =
            !statusFilter ||
            application.status ===
              statusFilter;

          const matchesPayment =
            !paymentFilter ||
            application.payment_status ===
              paymentFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPayment
          );
        }
      );
    }, [
      applications,
      leads,
      courses,
      search,
      statusFilter,
      paymentFilter,
    ]);

  const totalApplications =
    applications.length;

  const submittedApplications =
    applications.filter(
      (application) =>
        application.status ===
          "Submitted" ||
        application.status ===
          "Under Review" ||
        application.status ===
          "Approved"
    ).length;

  const approvedApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Approved"
    ).length;

  const paidApplications =
    applications.filter(
      (application) =>
        application.payment_status ===
        "Paid"
    ).length;

  const generateApplicationNumber =
    () => {
      const now = new Date();

      const year =
        now.getFullYear();

      const randomPart =
        Math.floor(
          1000 +
            Math.random() * 9000
        );

      return `APP-${year}-${randomPart}`;
    };

  const getCurrentDateTime = () => {
    const now = new Date();

    const offset =
      now.getTimezoneOffset();

    const localDate =
      new Date(
        now.getTime() -
          offset * 60000
      );

    return localDate
      .toISOString()
      .slice(0, 16);
  };

  const openAddModal = () => {
    setEditingApplication(null);

    setForm({
      ...emptyForm,
      lead_id: leads[0]?.id
        ? String(leads[0].id)
        : "",
      application_number:
        generateApplicationNumber(),
      application_date:
        getCurrentDateTime(),
      status: "Not Started",
      fee_amount: "0",
      payment_status: "Pending",
      remarks: "",
    });

    setShowModal(true);
  };

  const openEditModal =
    (application) => {
      setEditingApplication(
        application
      );

      setForm({
        lead_id:
          application.lead_id
            ? String(
                application.lead_id
              )
            : "",

        application_number:
          application.application_number ||
          "",

        application_date:
          application.application_date
            ? formatForInput(
                application.application_date
              )
            : "",

        status:
          application.status ||
          "Not Started",

        fee_amount:
          application.fee_amount ??
          "0",

        payment_status:
          application.payment_status ||
          "Pending",

        remarks:
          application.remarks ||
          "",
      });

      setShowModal(true);
    };

  const closeModal = () => {
    setShowModal(false);

    setEditingApplication(
      null
    );

    setForm(emptyForm);
  };

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!form.lead_id) {
        alert(
          "Please select a student."
        );
        return;
      }

      if (
        !form.application_number.trim()
      ) {
        alert(
          "Please enter application number."
        );
        return;
      }

      const feeAmount = Number(
        form.fee_amount || 0
      );

      if (
        !Number.isFinite(
          feeAmount
        )
      ) {
        alert(
          "Please enter a valid fee amount."
        );
        return;
      }

      if (feeAmount < 0) {
        alert(
          "Fee amount cannot be negative."
        );
        return;
      }

      const payload = {
        lead_id: Number(
          form.lead_id
        ),

        application_number:
          form.application_number.trim(),

        application_date:
          form.application_date ||
          null,

        status:
          form.status,

        fee_amount:
          feeAmount,

        payment_status:
          form.payment_status,

        remarks:
          form.remarks.trim() ||
          null,
      };

      try {
        let response;

        if (editingApplication) {
          response =
            await fetch(
              `${API_URL}/applications/${editingApplication.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );
        } else {
          response =
            await fetch(
              `${API_URL}/applications`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body:
                  JSON.stringify(
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
              "Failed to save application"
          );
        }

        closeModal();

        await loadData();
      } catch (error) {
        console.error(error);

        alert(
          error.message ||
            "Failed to save application."
        );
      }
    };

  const deleteApplication =
    async (application) => {
      const confirmed =
        window.confirm(
          `Delete application ${application.application_number}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/applications/${application.id}`,
            {
              method: "DELETE",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to delete application"
          );
        }

        await loadData();
      } catch (error) {
        console.error(error);

        alert(
          "Failed to delete application."
        );
      }
    };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentFilter("");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Admissions
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Applications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track student applications,
                payments and admission progress.
              </p>

            </div>

            <button
              onClick={
                openAddModal
              }
              disabled={
                leads.length === 0
              }
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + New Application
            </button>

          </div>

        </div>

      </div>

      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

        {/* KPI */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            title="Total Applications"
            value={
              totalApplications
            }
          />

          <KpiCard
            title="Submitted / Review"
            value={
              submittedApplications
            }
          />

          <KpiCard
            title="Approved"
            value={
              approvedApplications
            }
          />

          <KpiCard
            title="Paid"
            value={
              paidApplications
            }
          />

        </div>

        {/* FILTERS */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>

              <h2 className="font-semibold text-slate-900">
                Application Management
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and filter applications.
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

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <input
              type="text"
              placeholder="Search student or application number..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            >

              <option value="">
                All Application Statuses
              </option>

              {applicationStatuses.map(
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
              value={
                paymentFilter
              }
              onChange={(event) =>
                setPaymentFilter(
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            >

              <option value="">
                All Payment Statuses
              </option>

              {paymentStatuses.map(
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

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-[1100px] w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Application
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Application Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fee
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment
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
                      Loading applications...
                    </td>

                  </tr>
                ) : filteredApplications.length ===
                  0 ? (
                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No applications found.
                    </td>

                  </tr>
                ) : (
                  filteredApplications.map(
                    (application) => (
                      <tr
                        key={
                          application.id
                        }
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <p className="text-sm font-semibold text-slate-900">
                            {
                              application.application_number
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            ID #
                            {
                              application.id
                            }
                          </p>

                        </td>

                        <td className="px-6 py-4">

                          <p className="text-sm font-semibold text-slate-900">
                            {
                              getStudentName(
                                application.lead_id
                              )
                            }
                          </p>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {
                            getCourseName(
                              application.lead_id
                            )
                          }
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {
                            formatDate(
                              application.application_date
                            )
                          }
                        </td>

                        <td className="px-6 py-4">

                          <ApplicationStatusBadge
                            status={
                              application.status
                            }
                          />

                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-slate-700">

                          ₹
                          {Number(
                            application.fee_amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>

                        <td className="px-6 py-4">

                          <PaymentBadge
                            status={
                              application.payment_status
                            }
                          />

                        </td>

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3 whitespace-nowrap">

                            <button
                              onClick={() =>
                                openEditModal(
                                  application
                                )
                              }
                              className="text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteApplication(
                                  application
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
              {
                filteredApplications.length
              }{" "}
              of{" "}
              {applications.length}{" "}
              applications
            </p>

          </div>

        </div>

      </main>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingApplication
                    ? "Edit Application"
                    : "New Application"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter application and payment information.
                </p>

              </div>

              <button
                onClick={
                  closeModal
                }
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5 p-6"
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Student *
                  </label>

                  <select
                    name="lead_id"
                    value={
                      form.lead_id
                    }
                    onChange={
                      handleChange
                    }
                    className="input"
                    required
                  >

                    <option value="">
                      Select student
                    </option>

                    {leads.map(
                      (lead) => (
                        <option
                          key={
                            lead.id
                          }
                          value={
                            lead.id
                          }
                        >
                          {
                            lead.student_name
                          }{" "}
                          —{" "}
                          {
                            lead.phone
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Application Number *
                  </label>

                  <input
                    name="application_number"
                    value={
                      form.application_number
                    }
                    onChange={
                      handleChange
                    }
                    className="input"
                    required
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Application Date
                  </label>

                  <input
                    type="datetime-local"
                    name="application_date"
                    value={
                      form.application_date
                    }
                    onChange={
                      handleChange
                    }
                    className="input"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Application Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                    className="input"
                  >

                    {applicationStatuses.map(
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

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Fee Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="fee_amount"
                    value={
                      form.fee_amount
                    }
                    onChange={
                      handleChange
                    }
                    className="input"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment Status
                  </label>

                  <select
                    name="payment_status"
                    value={
                      form.payment_status
                    }
                    onChange={
                      handleChange
                    }
                    className="input"
                  >

                    {paymentStatuses.map(
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

                </div>

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Remarks
                  </label>

                  <textarea
                    name="remarks"
                    value={
                      form.remarks
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                    placeholder="Enter application remarks..."
                    className="input resize-none"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {editingApplication
                    ? "Update Application"
                    : "Create Application"}
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

function ApplicationStatusBadge({
  status,
}) {
  const styles = {
    "Not Started":
      "bg-slate-100 text-slate-600",

    "In Progress":
      "bg-blue-50 text-blue-700",

    Submitted:
      "bg-indigo-50 text-indigo-700",

    "Under Review":
      "bg-amber-50 text-amber-700",

    Approved:
      "bg-emerald-50 text-emerald-700",

    Rejected:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "-"}
    </span>
  );
}

function PaymentBadge({
  status,
}) {
  const styles = {
    Pending:
      "bg-red-50 text-red-700",

    Partial:
      "bg-amber-50 text-amber-700",

    Paid:
      "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "-"}
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function formatForInput(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export default Applications;