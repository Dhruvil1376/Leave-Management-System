using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    Password = u.Password,
                    IsActive = u.isActive,
                    ProfileImage = u.ProfileImage,
                    RoleId = u.RoleId,
                    RoleName = u.Role.RoleName
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<UserDTO>>
            {
                Success = true,
                Message = "Users retrieved successfully",
                Data = users
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.UserId == id)
                .Select
                (u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    Password = u.Password,
                    IsActive = u.isActive,
                    ProfileImage = u.ProfileImage,
                    RoleId = u.RoleId,
                    RoleName = u.Role.RoleName
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "User not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<UserDTO>
            {
                Success = true,
                Message = "User retrieved successfully",
                Data = user
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDTO user)
        {
            if (user == null)
            {
                return BadRequest(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "User data is required!!!",
                    Data = null
                });
            }

            var newUser = new User()
            {
                FullName = user.FullName,
                Email = user.Email,
                Password = user.Password,
                isActive = user.IsActive,
                ProfileImage = user.ProfileImage,
                RoleId = user.RoleId
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var createdUser = await _context.Users
                .Where(u => u.UserId == newUser.UserId)
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    IsActive = u.isActive,
                    ProfileImage = u.ProfileImage,
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.RoleName : null
                })
                .FirstOrDefaultAsync();

            return Ok(new ApiResponse<UserDTO>
            {
                Success = true,
                Message = "User created successfully",
                Data = createdUser
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDTO user)
        {
            if (user == null)
            {
                return BadRequest(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "User data is required!!!",
                    Data = null
                });
            }

            if (id != user.UserId)
            {
                return BadRequest(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "ID Mismatch!!!",
                    Data = null
                });
            }

            var oldUser = await _context.Users.FindAsync(id);            

            if (oldUser == null)
            {
                return NotFound(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "User not found!!!",
                    Data = null
                });
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email && u.UserId != id))
            {
                return BadRequest(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "Email already exists!!!",
                    Data = null
                });
            }

            if (!await _context.Roles.AnyAsync(r => r.RoleId == user.RoleId))
            {
                return BadRequest(new ApiResponse<UserDTO>
                {
                    Success = false,
                    Message = "Invalid RoleId!!!",
                    Data = null
                });
            }

            oldUser.FullName = user.FullName;
            oldUser.Email = user.Email;
            oldUser.ProfileImage = user.ProfileImage;
            oldUser.isActive = user.IsActive; 
            oldUser.RoleId = user.RoleId;

            await _context.SaveChangesAsync();

            var updatedUser = await _context.Users
                .Where(u => u.UserId == id)
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    IsActive = u.isActive,
                    ProfileImage = u.ProfileImage,
                    RoleId = u.RoleId,
                    RoleName = u.Role.RoleName
                })
                .FirstOrDefaultAsync();

            return Ok(new ApiResponse<UserDTO>
            {
                Success = true,
                Message = "User updated successfully",
                Data = updatedUser
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "User not found",
                    Data = null
                });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "User Deleted Successfully!!!",
                Data = null
            });
        }
    }
}