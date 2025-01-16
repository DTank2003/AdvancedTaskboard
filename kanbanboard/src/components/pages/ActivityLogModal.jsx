import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/ActivityLogModal.css';

const ActivityLogModal = ({ isOpen, onRequestClose, taskId }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchLogs();
        }
    }, [isOpen]);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await axiosInstance.get(`/tasks/${taskId}/logs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLogs(data);
        } catch (error) {
            console.error('Error fetching activity logs:', error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Activity Log">
            <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
            <button onClick={onRequestClose} className="absolute top-0 right-0 p-2">Close</button>
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log._id} className="p-4 bg-white shadow-md rounded-lg">
                        <p><strong>User:</strong> {log.userId.username}</p>
                        <p><strong>Action:</strong> {log.action}</p>
                        <p><strong>Task:</strong> {log.taskId.title}</p>
                        <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

ActivityLogModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    taskId: PropTypes.string.isRequired,
};

export default ActivityLogModal;