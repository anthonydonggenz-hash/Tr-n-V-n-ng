import { GoogleGenAI, Type } from "@google/genai";
import { ResultData } from "../types";

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || "";
};

export const suggestFromContent = async (
  topic: string,
  subject: string,
  grade: string,
  fileData?: { data: string, mimeType: string },
  isIntegration: boolean = false
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Lỗi: Chưa cấu hình GEMINI_API_KEY. Vui lòng kiểm tra lại môi trường.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let prompt = `Bạn là trợ lý giảng dạy AI. 
  NHIỆM VỤ: ${isIntegration ? 'Trích xuất CHÍNH XÁC và TOÀN BỘ nội dung giáo án từ tài liệu đã tải lên.' : 'Phân tích tài liệu và đề xuất nội dung chi tiết cho bài dạy:'}
  Môn: ${subject}
  Lớp: ${grade}
  Chủ đề: ${topic}
  
  Yêu cầu: 
  ${isIntegration 
    ? 'HÃY TRÍCH XUẤT 100% VĂN BẢN (TUYỆT ĐỐI KHÔNG TÓM TẮT, KHÔNG LƯỢC BỚT, KHÔNG THAY ĐỔI TỪ NGỮ) có trong file giáo án của giáo viên. Mục tiêu là lấy lại nguyên bản nội dung để sau đó AI sẽ thực hiện tích hợp NLS/AI vào chính nội dung này. Giữ nguyên cấu trúc các mục (Mục tiêu, Thiết bị, Hoạt động GV-HS...). Nếu file là hình ảnh, hãy OCR thật kỹ từng câu chữ.' 
    : 'Trích xuất các kiến thức cốt lõi, ví dụ và bài tập thực hành từ tài liệu. Nếu không có tài liệu, hãy tự soạn nội dung chuẩn theo chương trình GDPT 2018.'}`;

    const parts: any[] = [{ text: prompt }];
    if (fileData) {
      parts.push({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts }]
    });
    
    return response.text || "Không có nội dung phản hồi.";
  } catch (err: any) {
    console.error("Ai Suggest Error:", err);
    return "Không thể trích xuất nội dung từ tài liệu. Vui lòng kiểm tra API Key.";
  }
};

export const generateLessonPlan = async (
  mode: 'creation' | 'integration', 
  formData: any,
  extractedContent?: string,
  frameworkContent?: string
): Promise<ResultData> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Chưa cấu hình GEMINI_API_KEY. Vui lòng kiểm tra lại môi trường.");
  }
  
  try {
    const isTT02 = formData.selectedFramework === 'TT02' || formData.selectedFramework === 'TT02_QD3439';
    const isQD3439 = formData.selectedFramework === 'QD3439' || formData.selectedFramework === 'TT02_QD3439';
    const ai = new GoogleGenAI({ apiKey });

    // Determine regulation based on grade
    let gradeInfo = { level: 'Trung học', regulation: 'Công văn 5512' };
    if (formData.grade === 'Mầm Non') {
      gradeInfo = { level: 'Mầm non', regulation: 'Thông tư 49' };
    } else {
      const g = parseInt(formData.grade);
      if (g >= 1 && g <= 5) {
        gradeInfo = { level: 'Tiểu học', regulation: 'Công văn 2345' };
      } else if (g >= 6 && g <= 12) {
        gradeInfo = { level: 'Trung học', regulation: 'Công văn 5512' };
      }
    }

    const systemPrompt = `Bạn là chuyên gia giáo dục cao cấp, am hiểu sâu sắc về hệ thống quy định của Bộ Giáo dục và Đào tạo Việt Nam, đặc biệt là Thông tư 02/2025/TT-BGDĐT và Quyết định 3439/QĐ-BGDĐT.
    NHIỆM VỤ: Soạn thảo hoặc Tích hợp ${isTT02 ? 'Năng lực số (NLS) theo Thông tư 02' : ''} ${isTT02 && isQD3439 ? 'và' : ''} ${isQD3439 ? 'Trí tuệ nhân tạo (AI) theo Quyết định 3439' : ''} vào giáo án.

    TIÊU CHUẨN CẤU TRÚC GIÁO ÁN:
    Sử dụng khung cấu trúc bài dạy chuẩn theo: ${gradeInfo.regulation} (Dành cho cấp ${gradeInfo.level}).
    - Nếu là 5512: I. Mục tiêu (Kiến thức, Năng lực, Phẩm chất); II. Thiết bị; III. Tiến trình (4 hoạt động: Xác định vấn đề -> Hình thành kiến thức -> Luyện tập -> Vận dụng).
    - Nếu là 2345: Tập trung vào các hoạt động học tập của HS, Mục tiêu Yêu cầu cần đạt, Đánh giá.
    - Nếu là TT 49 (Mầm non): Mục đích - Yêu cầu, Chuẩn bị, Tiến hành hoạt động.

    YÊU CẦU VỀ NĂNG LỰC SỐ (Circular 02):
    - Mã chỉ báo phải TUYỆT ĐỐI CHÍNH XÁC theo cú pháp: (NLS x.x – TCx.x – CBx.x.x – Bậc …)
    - x.x: Miền và năng lực thành phần (6 miền, 24 năng lực).
    - TC: Tiêu chí.
    - CB: Chỉ báo cụ thể.
    - Bậc: Bậc thành thạo (1-8).

    YÊU CẦU VỀ TRÍ TUỆ NHÂN TẠO (Decision 3439):
    - Chỉ tích hợp nếu bài học thực sự phù hợp với AI, không khiên cưỡng.
    - Mã năng lực AI theo cú pháp: AI: (NLa / NLb / NLc / NLd)
      + NLa: Tư duy lấy con người làm trung tâm.
      + NLb: Đạo đức AI.
      + NLc: Các kĩ thuật và ứng dụng AI.
      + NLd: Thiết kế hệ thống AI.

    CẤU TRÚC KHỐI CHÈN (TUÂN THỦ 100%):
    Toàn bộ nội dung tích hợp phải nằm trong thẻ <span style="color:red">...</span> và trình bày đúng mẫu sau:
    
    🔴 [Tích hợp ${isTT02 && isQD3439 ? 'NLS & AI' : isTT02 ? 'NLS' : 'AI'}]
    - Năng lực: [Ghi đủ mã NLS và mã AI theo đúng cú pháp yêu cầu trên]
    - Mô tả: [Mô tả hành vi tích hợp cụ thể, bám sát bản chất hoạt động]

    🔴 [GV]
    - [Hướng dẫn từng bước cho giáo viên triển khai, nêu rõ công cụ số/AI tool cụ thể]

    🔴 [HS]
    - [Hành động rõ ràng, cụ thể của học sinh]

    🔴 [Sản phẩm]
    - [Sản phẩm số hoặc sản phẩm AI cụ thể mà học sinh tạo ra]

    🔴 [Đánh giá]
    - [Tiêu chí đánh giá dựa trên chỉ báo CB của NLS hoặc Năng lực AI]

    NGUYÊN TẮC "BẢO TỒN TUYỆT ĐỐI 100%" (Khi ở chế độ Tích hợp):
    1. GIỮ NGUYÊN 100% NỘI DUNG GIÁO ÁN GỐC: Tuyệt đối không được viết lại, không thay đổi, không rút gọn nội dung cũ của giáo viên. Giữ nguyên bố cục, trình tự.
    2. CHỈ CHÈN THÊM NỘI DUNG TÍCH HỢP: Chèn các khối tích hợp vào đúng vị trí sau nội dung phù hợp.
    3. ĐỊNH DẠNG CHỮ MÀU ĐỎ: Toàn bộ nội dung tích hợp và tiêu đề của nó PHẢI hiển thị bằng chữ màu đỏ (nằm trong thẻ <span style="color:red">...</span>).

    ĐỊNH DẠNG ĐẦU RA: JSON.
    JSON Schema (BẮT BUỘC):
    {
      "lessonPlan": {
        "topic": "string", "subject": "string", "grade": "string", "duration": "string",
        "objectives": { "knowledge": ["string"], "competency": ["string"], "quality": ["string"] },
        "materials": ["string"],
        "activities": [
          {
            "name": "string", "objective": "string", "content": "string", "product": "string",
            "steps": [{ "stepName": "string", "teacherAction": "string", "output": "string" }],
            "digitalIntegration": { "code": "string", "requirement": "string", "description": "string" }
          }
        ]
      },
      "digitalPack": { "summary": "string", "mapping": [{ "activity": "string", "competencyCode": "string", "competency": "string", "tool": "string", "action": "string" }] }
    }`;

    const userPrompt = `Dưới đây là nội dung giáo án cần xử lý:
    Môn: ${formData.subject}, Lớp: ${formData.grade}, Chủ đề: ${formData.topic}
    
    NỘI DUNG GỐC (BẮT BUỘC GIỮ NGUYÊN 100%):
    ${extractedContent || formData.originalText}
    
    YÊU CẦU CỤ THỂ:
    1. GIỮ NGUYÊN TUYỆT ĐỐI "NỘI DUNG GỐC": Bao gồm từng câu, từng chữ, dấu câu, bố cục và trình tự. KHÔNG ĐƯỢC THAY ĐỔI DÙ CHỈ MỘT CHỮ CỦA GIÁO VIÊN.
    2. TÍCH HỢP NĂNG LỰC:
       - Nếu có NLS: Sử dụng đúng cú pháp "NLS: (NLS x.x – TCx.x – CBx.x.x – Bậc …)".
       - Nếu có AI: Sử dụng đúng cú pháp "AI: (NLa / NLb / NLc / NLd)" (Chỉ thêm nếu thực sự cần thiết).
       - Chỉ tích hợp cả hai nếu giáo viên chọn cả hai (${formData.selectedFramework === 'TT02_QD3439' ? 'ĐÃ CHỌN CẢ HAI' : 'CHỈ CHỌN MỘT TRONG HAI'}).
    3. CÁCH CHÈN: Chèn trực tiếp khối tích hợp (nằm trong thẻ <span style="color:red">...</span>) vào sau các nội dung phù hợp trong Mục tiêu, Thiết bị hoặc Hoạt động.
    4. CẤU TRÚC KHỐI ĐỎ (🔴):
       🔴 [Tích hợp ...]
       - Năng lực: ...
       - Mô tả: ...
       🔴 [GV]: ...
       🔴 [HS]: ...
       🔴 [Sản phẩm]: ...
       🔴 [Đánh giá]: ...
    5. Không được viết lại giáo án. Xuất kết quả dưới dạng JSON theo Schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "";
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", responseText);
      throw new Error("AI trả về định dạng không hợp lệ. Vui lòng thử lại.");
    }
    
    if (!parsedResult.lessonPlan) {
      throw new Error("AI không trả về cấu trúc lessonPlan hợp lệ.");
    }
    
    const lp = parsedResult.lessonPlan;
    if (!lp.objectives) lp.objectives = { knowledge: [], competency: [], quality: [] };
    if (!lp.materials) lp.materials = [];
    if (!lp.activities) lp.activities = [];
    
    lp.activities = lp.activities.map((act: any) => ({
      name: act.name || "Hoạt động",
      objective: act.objective || "",
      content: act.content || "",
      product: act.product || "",
      steps: Array.isArray(act.steps) ? act.steps.map((s: any) => ({
        stepName: s.stepName || "Bước",
        teacherAction: s.teacherAction || "",
        output: s.output || ""
      })) : [],
      digitalIntegration: act.digitalIntegration ? {
        code: act.digitalIntegration.code || "",
        requirement: act.digitalIntegration.requirement || "",
        description: act.digitalIntegration.description || ""
      } : undefined
    }));

    if (!parsedResult.digitalPack) parsedResult.digitalPack = { summary: "", mapping: [] };
    
    return {
      lessonPlan: lp,
      digitalPack: parsedResult.digitalPack,
      mode: mode
    };
  } catch (err: any) {
    console.error("Generate Error:", err);
    throw new Error("Lỗi khi tạo giáo án: " + (err.message || "Lỗi không xác định"));
  }
};

export const transformActivity = async (
  activity: any,
  methodType: string,
  subject: string,
  grade: string
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Bạn là chuyên gia sư phạm. Hãy chuyển đổi hoạt động giáo dục sau đây sang phương pháp: ${methodType}.
  Môn: ${subject}, Lớp: ${grade}
  Hoạt động gốc: ${JSON.stringify(activity)}
  
  YÊU CẦU:
  - Giữ nguyên cấu trúc JSON của hoạt động.
  - Thay đổi 'content', 'teacherAction', 'output' để phản ánh phương pháp mới.
  - ${methodType === 'gamification' ? 'Sử dụng các yếu tố trò chơi, luật chơi, điểm số.' : 'Sử dụng mô hình học tập ở nhà trước, đến lớp thực hành.'}
  - Trả về DUY NHẤT đối tượng JSON của hoạt động đã sửa.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  const responseText = response.text || "";
  const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const elaborateSection = async (
  sectionContent: string,
  userPrompt: string,
  sectionName: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Bạn là trợ lý soạn bài. Hãy viết chi tiết hơn/mở rộng nội dung sau đây dựa trên yêu cầu của giáo viên.
  Phần: ${sectionName}
  Nội dung hiện tại: ${sectionContent}
  Yêu cầu mở rộng: ${userPrompt}
  
  LƯU Ý: 
  - Trả về văn bản đã mở rộng, trình bày rõ ràng.
  - Sử dụng ngôn ngữ sư phạm chuẩn xác.
  - Có thể sử dụng thẻ <span style="color:red">...</span> cho các nội dung AI bổ sung.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });
  return response.text || "";
};
