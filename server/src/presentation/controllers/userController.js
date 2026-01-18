import UserService from "../../application/services/userService.js";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "../dtos/userDto.js";
import { ValidationError, NotFoundError } from "../../shared/utils/errors.js";

export async function getAllUsers(req, res) {
  const users = await UserService.list();
  const safeUsers = users.map((user) => new UserResponseDto(user));
  res.status(200).json(safeUsers);
}

export async function getUserById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid user ID");
  const user = await UserService.get(id);
  if (!user) throw new NotFoundError("User not found");
  res.status(200).json(new UserResponseDto(user));
}

export async function createUser(req, res) {
  const dto = new CreateUserDto(req.body);
  const created = await UserService.create(dto);
  res.status(201).json(new UserResponseDto(created));
}

export async function updateUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid user ID");
  const dto = new UpdateUserDto(req.body);
  const updated = await UserService.update(id, dto);
  res.status(200).json(new UserResponseDto(updated));
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid user ID");
  const deleted = await UserService.delete(id);
  res.status(200).json(new UserResponseDto(deleted));
}
