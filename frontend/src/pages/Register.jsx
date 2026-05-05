import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, UserPlus } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// ✅ UPDATED SCHEMA
const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['admin', 'staff'], 'Invalid role').required('Role is required'),

  // 🔥 NEW FIELD
  staffEmail: yup.string().when('role', {
    is: 'admin',
    then: (schema) => schema.required('Staff email is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
}).required();

const Register = () => {
  const { register: registerAction } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'staff'
    }
  });

  // 🔥 WATCH ROLE
  const role = watch('role');

  const onSubmit = async (data) => {
    try {
      await registerAction(
        data.name,
        data.email,
        data.password,
        data.role,
        data.staffEmail   // 🔥 PASS THIS
      );

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 items-center justify-center">
        <div className="text-white text-center p-12">
          <UserPlus size={80} className="mx-auto mb-6 text-brand-200" />
          <h1 className="text-4xl font-bold mb-4">Join Our System</h1>
          <p className="text-xl text-brand-100">
            Manage your inventory easily
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">

          <h2 className="text-2xl font-bold text-center mb-6">
            Create new account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password}
            />

            {/* ROLE */}
            <div>
              <label className="block mb-2 font-medium">Role</label>
              <div className="flex gap-4">
                <label>
                  <input type="radio" value="staff" {...register('role')} />
                  Staff
                </label>
                <label>
                  <input type="radio" value="admin" {...register('role')} />
                  Admin
                </label>
              </div>
            </div>

            {/* 🔥 STAFF EMAIL (ONLY ADMIN) */}
            {role === 'admin' && (
              <Input
                label="Staff Email"
                type="email"
                placeholder="Enter staff email"
                {...register('staffEmail')}
                error={errors.staffEmail}
              />
            )}

            <Button type="submit" isLoading={isSubmitting}>
              Register
            </Button>

            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600">
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;