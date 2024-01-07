// AddDataForm.tsx
import React, { useState, useEffect } from 'react';
import './AddDataForm.css';
import { BASE_URL } from './helper';
interface AddDataFormProps {
  onClose: () => void;
  onAdd: (data: { name: string; phoneNumber: string; email: string; hobbies: string }) => void;
  initialData?: { name: string; phoneNumber: string; email: string; hobbies: string; _id: string };
}

const AddDataForm: React.FC<AddDataFormProps> = ({ onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    hobbies: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    hobbies: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phoneNumber: '',
      email: '',
      hobbies: '',
    };

    // Name Validation
    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]{3,30}$/.test(formData.name)) {
      newErrors.name = 'Name should contain only letters and be between 3 and 30 characters';
      isValid = false;
    }

    // Phone Number Validation
    if (formData.phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format (10 digits)';
      isValid = false;
    }

    // Email Validation
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Hobbies Validation
    if (formData.hobbies.trim() === '') {
      newErrors.hobbies = 'Hobbies is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s,]{5,}$/.test(formData.hobbies)) {
      newErrors.hobbies = 'Hobbies should contain only letters, spaces, and commas, and be at least 5 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };



  const handleAdd = async () => {
    if (validateForm()) {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/user/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newUser = await response.json();
          onAdd(newUser);
          onClose();
      
        } else {
          const errorData = await response.json();
          console.error('Error creating user:', errorData);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  const handleUpdate = async () => {
    if (validateForm() && initialData) {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/user/update/${initialData._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          onClose();
          setFormData({
            name: '',
            phoneNumber: '',
            email: '',
            hobbies: '',
          });
        } else {
          const errorText = await response.text();
          console.error(`Error updating user: ${errorText}`);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <h2>{initialData ? 'Update' : 'Add'} Data</h2>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </label>
        <label>
          Phone Number:
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </label>
        <label>
          Email:
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>
        <label>
          Hobbies:
          <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
          {errors.hobbies && <span className="error-message">{errors.hobbies}</span>}
        </label>
        <div className="form-buttons">
          <button onClick={initialData ? handleUpdate : handleAdd}>
            {initialData ? 'Update' : 'Add'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddDataForm;
