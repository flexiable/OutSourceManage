import os

import base64
from django.db.models import Q
from PIL.Image import Image
from django.conf import settings
from django.core.cache import cache
from django.core.files.uploadedfile import InMemoryUploadedFile

from .serializer import AuthorSerializer, LeaveCheckSerializer, OffSiteCheckSerializer
from django.shortcuts import render

# Create your views here.

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.forms.models import model_to_dict
from django.db.utils import IntegrityError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FieldPersonnel, LeaveCheck, OffSiteCheck

from rest_framework import pagination


class MyPagination(PageNumberPagination):
    # 指定每一页的个数，默认为配置文件里面的PAGE_SIZE
    page_size = 10

    # 可以让前端指定每页个数，默认为空，这里指定page_size去指定显示个数
    page_size_query_param = 'page_size'

    # 可以让前端指定页码数，默认就是page参数去接收
    page_query_param = 'page'

    # 指定返回格式，根据需求返回一个总页数，数据存在results字典里返回
    def get_paginated_response(self, data):
        from collections import OrderedDict
        return Response(OrderedDict([('total', self.page.paginator.count), ('rows', data)]))

def Index(request):
    return render(request, "Index/index.html")

def Login(request):
    return render(request, "Login/index.html")



def fieldPersonnel(request):
    return render(request, "FieldPersonnel/allclients.html")


def fieldPersonnelAdd(request):
    return render(request, "FieldPersonnel/entranceAdd.html", {})

def leaveCheck(request):
    return render(request, "LeaveCheck/LeaveCheckLists.html")


def leaveCheckAdd(request):
    return render(request, "LeaveCheck/LeaveCheckAdd.html", {})


def offSite(request):
    return render(request, "OffSiteCheck/OffSiteLists.html")


def offSiteAdd(request):
    return render(request, "OffSiteCheck/OffSiteAdd.html", {})
class UsersView(APIView):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(UsersView, self).dispatch(request, *args, **kwargs)

    def get(self, request, pk=0):
        if pk:
            try:
                if len(request.FILES) == 0:

                    user = FieldPersonnel.objects.get(pk=pk)
                    user = model_to_dict(user)
                    return JsonResponse({'code': 200, 'message': 'success', 'data': user}, status=200)

                filename = request.FILES.get('filename')  # 获取文件
                download_file_path = os.path.join(settings.BASE_DIR, "files", filename)

                print("download_file_path", download_file_path)
                self.big_file_download(download_file_path, filename)

            except FieldPersonnel.DoesNotExist:
                return JsonResponse({'code': 404, 'message': '用户不存在'}, status=200)
        data = json.loads(request.body) if request.body else {}
        q=request.GET.get('searchText')#|company__contains=request.GET.get('searchText'),updated_time__contains=request.GET.get('searchText')
        users = list(FieldPersonnel.objects.filter(Q(name__contains = q)|Q(company__contains = q)|Q(updated_time__contains = q)).all().values())
        my_page = MyPagination()
        authors_page = my_page.paginate_queryset(queryset=users, request=request, view=self)
        s = AuthorSerializer(authors_page, many=True)
        return JsonResponse({'total': len(users), 'rows': s.data}, status=200)

    @csrf_exempt
    def post(self, request):
        body_content = request.body
        if len(request.FILES) > 0:
            myFile = request.FILES['filename']
            # json_dict = json.loads(body_content)
            # imgUrl = json_dict.get("imgUrl", None)
            # print(json_dict)
            # # imgUrl = body_content.imgUrl
            download_file_path = os.path.join(settings.BASE_DIR, "files", myFile.name)
            print(download_file_path)
            destination = open(download_file_path,'wb+')
            for chunk in myFile.chunks():
                destination.write(chunk)
            destination.close()
            return JsonResponse({'code': 201, 'message': 'created', 'data': 1}, status=201)
          
        data = json.loads(body_content)
        try:
            # users = list(FieldPersonnel.objects.filter(Q(name__contains = data.name)&Q(phone__contains = data.phone)).all().values())
            # if len(users) > 0:

            user = FieldPersonnel.objects.create(**data)
            user = model_to_dict(user)
            return JsonResponse({'code': 201, 'message': 'created', 'data': user}, status=201)
        except IntegrityError:
            return JsonResponse({'code': 400, 'message': '身份证号码已存在！'}, status=200)

    @csrf_exempt
    def put(self, request, pk=0):
        data = json.loads(request.body)
        user = FieldPersonnel.objects.get(pk=pk)
        for key, value in data.items():
            setattr(user, key, value)
        user.save()
        user = model_to_dict(user)
        return JsonResponse({'code': 200, 'message': 'updated', 'data': user}, status=200)

    @csrf_exempt
    def delete(self, request, pk=0):
        user = FieldPersonnel.objects.get(pk=pk)
        user.delete()
        return JsonResponse({'code': 204, 'message': 'deleted'}, status=204)


class LeaveCheckView(APIView):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(LeaveCheckView, self).dispatch(request, *args, **kwargs)

    def get(self, request, pk=0):
        if pk:
            try:
                if len(request.FILES) == 0:

                    user = LeaveCheck.objects.get(pk=pk)
                    user = model_to_dict(user)
                    return JsonResponse({'code': 200, 'message': 'success', 'data': user}, status=200)

                filename = request.FILES.get('filename')  # 获取文件
                download_file_path = os.path.join(settings.BASE_DIR, "files", filename)

                print("download_file_path", download_file_path)
                self.big_file_download(download_file_path, filename)

            except LeaveCheck.DoesNotExist:
                return JsonResponse({'code': 404, 'message': '用户不存在'}, status=200)
        data = json.loads(request.body) if request.body else {}
        q=request.GET.get('searchText')#|company__contains=request.GET.get('searchText'),updated_time__contains=request.GET.get('searchText')
        users = list(LeaveCheck.objects.filter(Q(name__contains = q)|Q(company__contains = q)|Q(created_time__contains = q)).all().values())
        my_page = MyPagination()
        authors_page = my_page.paginate_queryset(queryset=users, request=request, view=self)
        s = LeaveCheckSerializer(authors_page, many=True)
        return JsonResponse({'total': len(users), 'rows': s.data}, status=200)

    @csrf_exempt
    def post(self, request):
        body_content = request.body
        if len(request.FILES) > 0:
            myFile = request.FILES['filename']
            download_file_path = os.path.join(settings.BASE_DIR, "files", myFile.name)
            destination = open(download_file_path,'wb+')
            for chunk in myFile.chunks():
                destination.write(chunk)
            destination.close()
            return JsonResponse({'code': 201, 'message': 'created', 'data': 1}, status=201)
          
        data = json.loads(body_content)
        try:
        
            user = LeaveCheck.objects.create(**data)
            user = model_to_dict(user)
            return JsonResponse({'code': 201, 'message': 'created', 'data': user}, status=201)
        except IntegrityError:
            return JsonResponse({'code': 400, 'message': '身份证号码已存在！'}, status=200)

    @csrf_exempt
    def put(self, request, pk=0):
        data = json.loads(request.body)
        user = LeaveCheck.objects.get(pk=pk)
        for key, value in data.items():
            setattr(user, key, value)
        user.save()
        user = model_to_dict(user)
        return JsonResponse({'code': 200, 'message': 'updated', 'data': user}, status=200)

    @csrf_exempt
    def delete(self, request, pk=0):
        user = LeaveCheck.objects.get(pk=pk)
        user.delete()
        return JsonResponse({'code': 204, 'message': 'deleted'}, status=204)

class OffSiteCheckView(APIView):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(OffSiteCheckView, self).dispatch(request, *args, **kwargs)

    def get(self, request, pk=0):
        if pk:
            try:
                if len(request.FILES) == 0:

                    user = OffSiteCheck.objects.get(pk=pk)
                    user = model_to_dict(user)
                    return JsonResponse({'code': 200, 'message': 'success', 'data': user}, status=200)

               

            except OffSiteCheck.DoesNotExist:
                return JsonResponse({'code': 404, 'message': '用户不存在'}, status=200)
        data = json.loads(request.body) if request.body else {}
        q=request.GET.get('searchText')#|company__contains=request.GET.get('searchText'),updated_time__contains=request.GET.get('searchText')
        users = list(OffSiteCheck.objects.filter(Q(name__contains = q)|Q(phone__contains = q)|Q(created_time__contains = q)).all().values())
        my_page = MyPagination()
        authors_page = my_page.paginate_queryset(queryset=users, request=request, view=self)
        s = OffSiteCheckSerializer(authors_page, many=True)
        return JsonResponse({'total': len(users), 'rows': s.data}, status=200)

    @csrf_exempt
    def post(self, request):
        body_content = request.body
        if len(request.FILES) > 0:
            myFile = request.FILES['filename']
            download_file_path = os.path.join(settings.BASE_DIR, "files", myFile.name)
            destination = open(download_file_path,'wb+')
            for chunk in myFile.chunks():
                destination.write(chunk)
            destination.close()
            return JsonResponse({'code': 201, 'message': 'created', 'data': 1}, status=201)
          
        data = json.loads(body_content)
        try:
        
            user = OffSiteCheck.objects.create(**data)
            user = model_to_dict(user)
            return JsonResponse({'code': 201, 'message': 'created', 'data': user}, status=201)
        except IntegrityError:
            return JsonResponse({'code': 400, 'message': '已存在！'}, status=200)

    @csrf_exempt
    def put(self, request, pk=0):
        data = json.loads(request.body)
        user = OffSiteCheck.objects.get(pk=pk)
        for key, value in data.items():
            setattr(user, key, value)
        user.save()
        user = model_to_dict(user)
        return JsonResponse({'code': 200, 'message': 'updated', 'data': user}, status=200)

    @csrf_exempt
    def delete(self, request, pk=0):
        user = OffSiteCheck.objects.get(pk=pk)
        user.delete()
        return JsonResponse({'code': 204, 'message': 'deleted'}, status=204)


