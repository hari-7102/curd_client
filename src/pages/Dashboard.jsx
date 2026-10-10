
import React, { useEffect, useState } from "react";

import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";

const initialForm = {
  name: "",
  email: "",
  qualification: "",
  address: "",
  age: "",
  salary: "",
  occupation: "",
  educationInstitute: "",
};

const Dashboard = () => {
  const [formData, setFormData] = useState(initialForm);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();
      setCustomers(data.customers || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (editingId) {
        await updateCustomer(editingId, formData);
      } else {
        await createCustomer(formData);
      }

      resetForm();
      await fetchCustomers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      qualification: customer.qualification || "",
      address: customer.address || "",
      age: customer.age ?? "",
      salary: customer.salary ?? "",
      occupation: customer.occupation || "",
      educationInstitute: customer.educationInstitute || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      setError("");
      await deleteCustomer(id);
      await fetchCustomers();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Customer Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your customer records
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Customer Form */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? "Update Customer" : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Edit the customer information below."
                : "Enter the details to create a new customer."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="qualification"
                >
                  Qualification
                </label>
                <input
                  id="qualification"
                  name="qualification"
                  placeholder="Enter qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="salary">
                  Salary
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  placeholder="Enter salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="occupation"
                >
                  Occupation
                </label>
                <input
                  id="occupation"
                  name="occupation"
                  placeholder="Enter occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="educationInstitute"
                >
                  Education Institute
                </label>
                <input
                  id="educationInstitute"
                  name="educationInstitute"
                  placeholder="Enter institute"
                  value={formData.educationInstitute}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Customer"
                    : "Add Customer"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Customer Table */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Customers
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Total customers: {customers.length}
              </p>
            </div>

            <button
              onClick={fetchCustomers}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
              Loading customers...
            </p>
          ) : customers.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
              No customers found. Add your first customer above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">
                      Qualification
                    </th>
                    <th className="px-5 py-3 font-medium">Address</th>
                    <th className="px-5 py-3 font-medium">Age</th>
                    <th className="px-5 py-3 font-medium">Salary</th>
                    <th className="px-5 py-3 font-medium">
                      Occupation
                    </th>
                    <th className="px-5 py-3 font-medium">Institute</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                        {customer.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.email}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.qualification || "-"}
                      </td>

                      <td className="max-w-48 truncate px-5 py-4 text-gray-600">
                        {customer.address || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.age ?? "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {customer.salary ?? "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.occupation || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.educationInstitute || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(customer._id)
                            }
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
