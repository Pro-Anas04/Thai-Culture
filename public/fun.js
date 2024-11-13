function confirmDelete(id) {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้ หมายเลขID ${id}?`)) {
        window.location.href = `/edit-info/delete/${id}`;
    }
}