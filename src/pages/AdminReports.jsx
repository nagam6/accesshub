import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock3,
  Flag,
  XCircle,
} from 'lucide-react'
import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { toast } from 'react-toastify'

import { db } from '../firebase/firebase'

import './AdminReports.css'

function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true)

        const snapshot = await getDocs(
          collection(db, 'reports')
        )

        const reportData = snapshot.docs.map(
          (reportDocument) => ({
            firestoreId: reportDocument.id,
            ...reportDocument.data(),
          })
        )

        reportData.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )

        setReports(reportData)
      } catch (error) {
        console.error(
          'Error loading reports:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  async function handleStatusChange(
    reportId,
    newStatus
  ) {
    try {
      await updateDoc(
        doc(
          db,
          'reports',
          reportId
        ),
        {
          status: newStatus,
          reviewedAt:
            new Date().toISOString(),
        }
      )

      setReports((current) =>
        current.map((report) =>
          report.firestoreId === reportId
            ? {
                ...report,
                status: newStatus,
              }
            : report
        )
      )

      toast.success(
        newStatus === 'resolved'
          ? 'Report marked as resolved.'
          : 'Report dismissed.'
      )
    } catch (error) {
      console.error(
        'Error updating report:',
        error
      )

      toast.error(
        'Could not update the report.'
      )
    }
  }

  function renderStatus(status) {
    if (status === 'resolved') {
      return (
        <span className="report-status resolved">
          <CheckCircle2 size={14} />
          Resolved
        </span>
      )
    }

    if (status === 'dismissed') {
      return (
        <span className="report-status dismissed">
          <XCircle size={14} />
          Dismissed
        </span>
      )
    }

    return (
      <span className="report-status open">
        <Clock3 size={14} />
        Open
      </span>
    )
  }

  return (
    <main className="admin-reports-page">
      <div className="admin-reports-container">
        <Link
          to="/admin"
          className="admin-back-link"
        >
          ← Back to Dashboard
        </Link>

        <div className="admin-reports-heading">
          <span className="section-label">
            COMMUNITY REPORTS
          </span>

          <h1>Reported Information</h1>

          <p>
            Review incorrect or outdated place information
            reported by AccessHub users.
          </p>
        </div>

        {loading ? (
          <div className="admin-reports-empty">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="admin-reports-empty">
            No reports found.
          </div>
        ) : (
          <div className="admin-reports-list">
            {reports.map((report) => (
              <article
                key={report.firestoreId}
                className="admin-report-card"
              >
                <div className="admin-report-top">
                  <div>
                    <div className="admin-report-title">
                      <Flag size={20} />

                      <h2>
                        {report.placeName ||
                          `Place ${report.placeId}`}
                      </h2>
                    </div>

                    <p className="admin-report-meta">
                      Reported by{' '}
                      {report.userName ||
                        'Unknown user'}
                    </p>
                  </div>

                  {renderStatus(report.status)}
                </div>

                <div className="admin-report-reason">
                  <strong>
                    Reported issue
                  </strong>

                  <p>{report.reason}</p>
                </div>

                <div className="admin-report-footer">
                  <span>
                    {report.createdAt
                      ? new Date(
                          report.createdAt
                        ).toLocaleDateString()
                      : ''}
                  </span>

                  {report.status === 'open' && (
                    <div className="admin-report-actions">
                      <button
                        type="button"
                        className="report-dismiss-button"
                        onClick={() =>
                          handleStatusChange(
                            report.firestoreId,
                            'dismissed'
                          )
                        }
                      >
                        <XCircle size={16} />
                        Dismiss
                      </button>

                      <button
                        type="button"
                        className="report-resolve-button"
                        onClick={() =>
                          handleStatusChange(
                            report.firestoreId,
                            'resolved'
                          )
                        }
                      >
                        <CheckCircle2 size={16} />
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminReports