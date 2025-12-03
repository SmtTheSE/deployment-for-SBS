import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CertificateCard from "./CertificateCard";
import { motion } from "framer-motion";

const StudentCertificate = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/students/${studentId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // Mock certificates for demonstration if none exist in the API response
  const certificates =
    student?.certificates?.length > 0
      ? student.certificates
      : [
          {
            id: 1,
            title: "Advanced Web Development",
            description:
              "Mastering modern web technologies including React, Node.js, and Docker.",
            issueDate: "2023-11-15",
            issuer: "Saigon Business School",
            pdfUrl:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            id: 2,
            title: "Digital Marketing Fundamentals",
            description:
              "Understanding the core concepts of digital marketing and SEO strategies.",
            issueDate: "2023-08-20",
            issuer: "Google Digital Garage",
            pdfUrl:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            id: 3,
            title: "Business Leadership",
            description: "Leadership skills for modern business environments.",
            issueDate: "2023-05-10",
            issuer: "Harvard Business School Online",
            pdfUrl:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        ];

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading student data...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {student?.firstName} {student?.lastName}'s Certificates
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and view all certificates issued to this student.
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <CertificateCard certificate={cert} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">
              No certificates found for this student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCertificate;
