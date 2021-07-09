# serializers.py
from django.db import models
from django.utils.deprecation import MiddlewareMixin
from rest_framework import serializers

from .models import FieldPersonnel, LeaveCheck,OffSiteCheck


class DisableCSRF(MiddlewareMixin):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldPersonnel
        fields = "__all__"

class LeaveCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveCheck
        fields = "__all__"

class OffSiteCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffSiteCheck
        fields = "__all__"
