
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, TableColumn } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];
  columns: TableColumn[] = [];
  editingRows: Set<number> = new Set();
  editingValues: { [key: string]: any } = {};
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Search properties
  searchTerm: string = '';
  filteredUsers: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.users$.subscribe(users => {
      this.allUsers = users;
      if (users.length > 0) {
        this.generateColumns(users[0]);
      }
      this.updatePagination();
    });
    this.userService.loadUsers();
  }

  updatePagination(): void {
    const usersToShow = this.searchTerm ? this.filteredUsers : this.allUsers;
    this.totalPages = Math.ceil(usersToShow.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.users = usersToShow.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      // Clear any editing states when changing pages
      this.editingRows.clear();
      this.editingValues = {};
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  generateColumns(sampleUser: User): void {
    this.columns = Object.keys(sampleUser).map(key => ({
      key,
      label: this.formatColumnLabel(key),
      type: typeof sampleUser[key]
    }));
  }

  formatColumnLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
  }

  onRowClick(user: User): void {
    // Only navigate if not currently editing any row
    if (this.editingRows.size === 0) {
      this.router.navigate(['/user', user['id']]);
    }
  }

  toggleRowEdit(rowIndex: number, event: Event): void {
    event.stopPropagation();
    
    if (this.editingRows.has(rowIndex)) {
      // Exit edit mode for this row
      this.editingRows.delete(rowIndex);
      // Clear editing values for this row
      this.columns.forEach(column => {
        delete this.editingValues[`${rowIndex}_${column.key}`];
      });
    } else {
      // Enter edit mode for this row
      this.editingRows.add(rowIndex);
      // Initialize editing values for all columns in this row
      this.columns.forEach(column => {
        this.editingValues[`${rowIndex}_${column.key}`] = this.users[rowIndex][column.key];
      });
    }
  }

  saveRowEdit(rowIndex: number, event: Event): void {
    event.stopPropagation();
    
    if (this.editingRows.has(rowIndex)) {
      const user = { ...this.users[rowIndex] };
      
      // Update user with all edited values
      this.columns.forEach(column => {
        const editKey = `${rowIndex}_${column.key}`;
        if (this.editingValues[editKey] !== undefined) {
          user[column.key] = this.editingValues[editKey];
        }
      });
      
      this.userService.updateUser(user);
      
      // Exit edit mode
      this.editingRows.delete(rowIndex);
      // Clear editing values for this row
      this.columns.forEach(column => {
        delete this.editingValues[`${rowIndex}_${column.key}`];
      });
    }
  }

  cancelRowEdit(rowIndex: number, event: Event): void {
    event.stopPropagation();
    
    if (this.editingRows.has(rowIndex)) {
      // Exit edit mode without saving
      this.editingRows.delete(rowIndex);
      // Clear editing values for this row
      this.columns.forEach(column => {
        delete this.editingValues[`${rowIndex}_${column.key}`];
      });
    }
  }

  isRowInEditMode(rowIndex: number): boolean {
    return this.editingRows.has(rowIndex);
  }

  getEditValue(rowIndex: number, column: string): any {
    const editKey = `${rowIndex}_${column}`;
    return this.editingValues[editKey] !== undefined ? this.editingValues[editKey] : this.users[rowIndex][column];
  }

  updateEditValue(rowIndex: number, column: string, value: any): void {
    const editKey = `${rowIndex}_${column}`;
    this.editingValues[editKey] = value;
  }

  formatCellValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  viewDetails(user: User, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/user', user['id']]);
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [];
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user => {
      return this.columns.some(column => {
        const value = user[column.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchLower);
      });
    });
    
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = [];
    this.currentPage = 1;
    this.updatePagination();
  }

  getDisplayedUserCount(): number {
    return this.searchTerm ? this.filteredUsers.length : this.allUsers.length;
  }

  // Make Math available in template
  Math = Math;
}
