import React from "react";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const CertificateCard = ({ certificate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Card Header / Image Placeholder */}
      <div className="h-32 bg-gradient-to-r from-red-400 to-iconic flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <Award className="text-white w-16 h-16 opacity-90" />
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {certificate.title || "Certificate of Completion"}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">
          {certificate.description ||
            "Successfully completed the requirements for this course."}
        </p>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-iconic" />
            <span>
              Issued:{" "}
              {certificate.issueDate
                ? new Date(certificate.issueDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {certificate.issuer && (
            <div className="flex items-center text-sm text-gray-600">
              <Award className="w-4 h-4 mr-2 text-iconic" />
              <span>Issuer: {certificate.issuer}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() =>
              certificate.pdfUrl && window.open(certificate.pdfUrl, "_blank")
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
              certificate.pdfUrl
                ? "bg-indigo-50 text-iconic hover:bg-indigo-100 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!certificate.pdfUrl}
          >
            <ExternalLink className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;