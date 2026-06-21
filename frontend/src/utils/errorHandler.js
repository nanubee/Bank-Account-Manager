export const getErrorMessage = (error) => {
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join("\n");
  }

  if (typeof detail === "object" && detail !== null) {
    return (
      detail.msg ||
      detail.message ||
      detail.error ||
      JSON.stringify(detail)
    );
  }

  return detail || "Something went wrong";
};