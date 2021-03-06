import axios from "axios";
import "dotenv/config";
require("dotenv").config();
const url = "http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001";

export const getInventory = async (params) => {
	return axios.post(
		`http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001/inventory/getInventory`,
		{ limit: params.limit, offset: params.offset, filters: params.filters },
		{
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZW1haWwiOiJ1c2FpYmtoYW5AZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0wNlQxNDo0MToyNi44NTlaIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY0NjU3NzY4Nn0._13xW9X2tTPM1bT9T3C32vCxNeP4K3GOJJummhWBYaM"
			}
		}
	);
};
export const getDispenseInRecords = async (params) => {
	return axios.post(
		`http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001/inventory/getDispenseInRecords`,
		{
			limit: params.limit,
			offset: params.offset,
			filters: params.filters,
			startDate: params.gte,
			endDate: params.lte
		},
		{
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZW1haWwiOiJ1c2FpYmtoYW5AZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0wNlQxNDo0MToyNi44NTlaIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY0NjU3NzY4Nn0._13xW9X2tTPM1bT9T3C32vCxNeP4K3GOJJummhWBYaM"
			}
		}
	);
};

export const createMedicine = async (params) => {
	return axios.post(
		`http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001/inventory/create`,
		{
			...params
		},
		{
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZW1haWwiOiJ1c2FpYmtoYW5AZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0wNlQxNDo0MToyNi44NTlaIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY0NjU3NzY4Nn0._13xW9X2tTPM1bT9T3C32vCxNeP4K3GOJJummhWBYaM"
			}
		}
	);
};

export const updateMedicine = async (params) => {
	return axios.post(
		`http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001/inventory/update`,
		{
			...params,
			role: "admin"
		},
		{
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZW1haWwiOiJ1c2FpYmtoYW5AZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0wNlQxNDo0MToyNi44NTlaIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY0NjU3NzY4Nn0._13xW9X2tTPM1bT9T3C32vCxNeP4K3GOJJummhWBYaM"
			}
		}
	);
};

export const remove = async (params) => {
	return axios.post(
		`http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001/inventory/remove`,
		{ id: params.id },
		{
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZW1haWwiOiJ1c2FpYmtoYW5AZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0wNlQxNDo0MToyNi44NTlaIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY0NjU3NzY4Nn0._13xW9X2tTPM1bT9T3C32vCxNeP4K3GOJJummhWBYaM"
			}
		}
	);
};

export const dispense = async (params) => {
	return axios.post(
		`http://ec2-3-145-193-221.us-east-2.compute.amazonaws.com:5001/inventory/dispense`,
		{ id: params.id, amount: params.amount },
		{
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwiZW1haWwiOiJ1c2FpYmtoYW5AZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0wNlQxNDo0MToyNi44NTlaIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY0NjU3NzY4Nn0._13xW9X2tTPM1bT9T3C32vCxNeP4K3GOJJummhWBYaM"
			}
		}
	);
};
