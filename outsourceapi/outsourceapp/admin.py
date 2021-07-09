from django.contrib import admin
from .models import FieldPersonnel

from django.contrib import admin
class MyAdmin(admin.ModelAdmin):
    def change_view(self, request, object_id, form_url='', extra_context=None):
        result_template = super(MyAdmin, self).change_view(request, object_id, form_url, extra_context)
        result_template['location'] = '/fieldPersonnel'
        return result_template
# Register your models here.

@admin.register(FieldPersonnel)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('name', 'sex', 'idcard', 'imgUrl', 'company','phone', 'created_time')

