import React, { useState, useEffect } from "react";
import CertificateCard from "./CertificateCard";
import { X, Award } from "lucide-react";
import { motion } from "framer-motion";

const AdminStudentCertificates = ({ student, onClose }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/academic/certificates/student/${student.studentId}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Transform the certificate data to match CertificateCard component expectations
        const transformedCertificates = data.map(cert => ({
          id: cert.id,
          title: "Uploaded Certificate",
          description: cert.description || "Certificate uploaded for this student",
          issueDate: cert.uploadedAt,
          issuer: "Saigon Business School",
          // 根据文件扩展名确定如何处理文件
          pdfUrl: cert.fileName ? 
            `http://localhost:8080/api/academic/certificates/download/${cert.fileName}` : 
            null
        }));
        
        setCertificates(transformedCertificates);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
        // Fallback to mock data if API fails
        const mockCertificates = [
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
          }
        ];
        setCertificates(mockCertificates);
      } finally {
        setLoading(false);
      }
    };

    if (student?.studentId) {
      fetchCertificates();
    }
  }, [student]);

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Award className="text-iconic" />
                {student?.firstName} {student?.lastName}'s Certificates
              </h2>
              <p className="text-gray-600 mt-1">
                Student ID: {student?.studentId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-iconic"></div>
              <p className="mt-4 text-gray-600">Loading certificates...</p>
            </div>
          ) : certificates.length > 0 ? (
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
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates</h3>
              <p className="mt-1 text-sm text-gray-500">
                This student doesn't have any certificates yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentCertificates;