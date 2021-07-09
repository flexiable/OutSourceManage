from django.db import models


class OffSiteCheck(models.Model):
   
    name = models.CharField(max_length=128, verbose_name='姓名')
    
    
    phone = models.CharField(max_length=14, verbose_name='手机号')

    check_time = models.DateTimeField(auto_now_add=False, verbose_name='审核时间', null=True)
    isCheck = models.BooleanField( default=False, verbose_name='已审核', null=True)
    start_time = models.DateTimeField(auto_now_add=False, verbose_name='开始时间')
   
    created_time = models.DateTimeField(auto_now_add=False, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now_add=True, verbose_name='更新时间')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = verbose_name_plural = '离场登记管理'

class LeaveCheck(models.Model):
   
    name = models.CharField(max_length=128, verbose_name='姓名')
    
    idcard = models.CharField(max_length=18, verbose_name='身份证号码')
    phone = models.CharField(max_length=14, verbose_name='手机号')
    company = models.CharField(max_length=256, verbose_name='工作单位名称')
    check_time = models.DateTimeField(auto_now_add=False, verbose_name='审核时间', null=True)
    isCheck = models.BooleanField( default=False, verbose_name='已审核', null=True)
    start_time = models.DateTimeField(auto_now_add=False, verbose_name='开始时间')
    end_time = models.DateTimeField(auto_now_add=False, verbose_name='结束时间')
    created_time = models.DateTimeField(auto_now_add=False, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now_add=True, verbose_name='更新时间')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = verbose_name_plural = '请假登记管理'

# Create your models here.
class FieldPersonnel(models.Model):
    SEX_ITEMS = (

        (1, '男'),
        (0, '女'),  (2, '未知'),
    )
    name = models.CharField(max_length=128, verbose_name='姓名')
    sex = models.IntegerField(choices=SEX_ITEMS, default=2, verbose_name='性别')
    idcard = models.CharField(max_length=18, verbose_name='身份证号码')
    phone = models.CharField(max_length=14, verbose_name='手机号')
    imgUrl = models.CharField(max_length=914, verbose_name='照片')
    isCheck = models.BooleanField( default=False, verbose_name='已审核', null=True)
    personState = models.BooleanField( default=True, verbose_name='是否在现场', null=True)
    check_time = models.DateTimeField(auto_now_add=False, verbose_name='审核时间', null=True)
    company = models.CharField(max_length=256, verbose_name='工作单位名称')
    fieldNum = models.IntegerField(default=1, verbose_name='进场次数')
    created_time = models.DateTimeField(auto_now_add=False, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = verbose_name_plural = '入场登记管理'
        
